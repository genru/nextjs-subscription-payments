'use server'
import { getErrorRedirect, getStatusRedirect } from "../helpers";
import { processYoutubeMediaUrl } from "../playlist/aws";
import { FeedInfo, PodInfo, parsePlaylist } from "../playlist/server";
import { createFeed, createMedias } from "../supabase/admin";
import { createClient } from "../supabase/server";
import assert from "assert";
import Redis from "ioredis";

assert(process.env['DB_REDIS_URL'], 'DB_REDIS_URL should be set');
const redis = new Redis(process.env['DB_REDIS_URL']);

export async function createFeedByPlaylist(formData: FormData) {
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
    if(!playlist_id) {
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
        const pod: PodInfo = await parsePlaylist(playlist_id) || '';

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
                duration_in_sec: 0
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

function isValidUrl(url: string) {
    // @ts-ignore
    return url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)?.length > 0;
}