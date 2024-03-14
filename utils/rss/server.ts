'use server'
import { getErrorRedirect, getStatusRedirect } from "../helpers";
import { processYoutubeMediaUrl } from "../playlist/aws";
import { FeedInfo, PodInfo, parsePlaylist, parseVideos } from "../playlist/server";
import { createFeed, createMedias } from "../supabase/admin";
import { createClient } from "../supabase/server";
import assert from "assert";
import Redis from "ioredis";

assert(process.env['DB_REDIS_URL'], 'DB_REDIS_URL should be set');
const redis = new Redis(process.env['DB_REDIS_URL']);

export async function createFeedByYoutube(formData: FormData) {
    const targetUrl = String(formData.get('url')).trim();

    let redirectPath: string;

    if (!targetUrl || !isValidUrl(targetUrl)) {
      redirectPath = getErrorRedirect(
        '/feeds/',
        'Invalid url address.',
        'Please try again.'
      );
      return redirectPath;
    }
    const url = new URL(targetUrl);
    const playlist_id = url.searchParams.get('list');
    const video_id = url.searchParams.get('v');
    if(!playlist_id && !video_id) {
        redirectPath = getErrorRedirect(
            '/feeds/',
            'Invalid url address.',
            'Please try again.'
        );
        return redirectPath;
    }

    const supabase = createClient();

    const {
        data: { user }
    } = await supabase.auth.getUser();
    if (!user) {

        redirectPath = getErrorRedirect('/signin', 'Invalid user', 'Please try again.');
        return redirectPath;
    }

    const { data: userDetails } = await supabase
        .from('users')
        .select('*')
        .single();
    if(!userDetails) {
        console.warn('No user');
        return getErrorRedirect('/signin', 'Invalid user', 'Please try again.');
    }
    let feed_uuid: string|undefined;
    try {
        let pod: PodInfo;
        if(playlist_id) {
            pod = await parsePlaylist(playlist_id) || '';
        } else if (video_id) {
            pod = await parseVideos(video_id) || '';
        } else {
            return getErrorRedirect(
                '/feeds/',
                'Invalid url address.',
                'Please try again.'
            );
        }


        const feedRaw: FeedInfo = {
            title: pod.feed.title,
            description: pod.feed.description || '',
            cover: pod.feed.imageUrl || '',
            author: pod.feed.author || 'unknown'
            // xml: pod.buildXml()
        };

        feed_uuid = await createFeed(feedRaw, userDetails.id, 'youtube');
        if(feed_uuid) {
            const podKey = `pod:${feed_uuid}`;
            const itemsKey = `items:${feed_uuid}`;
            await redis.set(podKey, JSON.stringify(pod), 'EX', 180);

            const ids = await createMedias(feed_uuid, pod.items.map(item => ({
                title: item.title,
                description: item.description,
                cover: item.itunesImage || '',
                author: item.author || 'unknown',
                source: 'youtube',
                guid: item.guid,
                duration_in_sec: +(item.itunesDuration || 0)
            })));

            if(ids.length > 0) {
                await redis.sadd(itemsKey, ids);
                await redis.expire(itemsKey, 60 * 3);
                for (let i = 0; i < ids.length; i++) {
                    processYoutubeMediaUrl(pod.items[i].guid, feed_uuid, ids[i]).catch(console.error);
                }
            } else {
                // NOTE: feed completed
                await supabase.from('feeds').update({status: 1}).eq('uuid', feed_uuid)
            }
        }
    } catch (err) {
        console.error(err)
        return getErrorRedirect('/feeds', 'Ooops', 'Something wrong, plz try again');;
    }
    console.info('updated feed', `/feeds/${feed_uuid}`);
    return getStatusRedirect('/feeds', 'Success!', 'New feed created successfully')
}

export async function removeFeedByUuid(formData: FormData) {
    const feed_uuid = formData.get('uuid');
    if (!feed_uuid) {
        return getErrorRedirect('/feeds', 'Ooops', 'Invalid feed');
    }

    const supabase = createClient();

    const {error: err} = await supabase.from('feedMedia').delete().eq('feed_id', feed_uuid);
    if (err) {
        return getErrorRedirect('/feeds', 'Ooops', 'Error removing feed');
    }
    const {error} = await supabase.from('feeds').delete().eq('uuid', feed_uuid);
    if (error) {
        console.error('error', error);
        return getErrorRedirect('/feeds', 'Ooops', 'Something wrong, plz try again');
    }

    return getStatusRedirect('/feeds', 'Success!', 'Feed removed successfully');
}

export async function addEpisodeByYoutube(formData: FormData) {
    const feedId = formData.get('feed_id') as string;
    const targetUrl = formData.get('url') as string;

    if(!feedId || !targetUrl) {
        return getErrorRedirect('/feeds', 'Ooops', 'Bad request');
    }

    // check URL
    const url = new URL(targetUrl);
    const video_id = url.searchParams.get('v');
    if(!video_id) {
        return getErrorRedirect(
            `/feeds/${feedId}`,
            'Invalid url address.',
            'Please try again.'
        );
    }

    const pod: PodInfo = await parseVideos(video_id);
    const supabase = createClient();

    let redirectPath: string;
    const {
        data: { user }
    } = await supabase.auth.getUser();
    if (!user) {

        redirectPath = getErrorRedirect('/signin', 'Invalid user', 'Please try again.');
        return redirectPath;
    }

    const { data: userDetails } = await supabase
        .from('users')
        .select('*')
        .single();
    if(!userDetails) {
        console.warn('No user');
        return getErrorRedirect('/signin', 'Invalid user', 'Please try again.');
    }

    if(feedId) {

        const ids = await createMedias(feedId, pod.items.map(item => ({
            title: item.title,
            description: item.description,
            cover: item.itunesImage || '',
            author: item.author || 'poddiy',
            source: 'youtube',
            guid: video_id,
            duration_in_sec: +(item.itunesDuration || 0)
        })));

        if(ids.length > 0) {
            const itemsKey = `items:${feedId}`;
            await redis.sadd(itemsKey, ids);
            await redis.expire(itemsKey, 60 * 3);
            for (let i = 0; i < ids.length; i++) {
                processYoutubeMediaUrl(video_id, feedId, ids[i]).catch(console.error);
            }
        } else {
            // NOTE: feed completed
            await supabase.from('feeds').update({status: 1}).eq('uuid', feedId)
        }
    }

    return getStatusRedirect(`/feeds/${feedId}/`, 'Congrated', 'new episode added');
}

function isValidUrl(url: string) {
    // @ts-ignore
    return url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)?.length > 0;
}