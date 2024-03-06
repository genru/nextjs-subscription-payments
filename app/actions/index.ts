import { processYoutubeMediaUrl } from "@/utils/playlist/aws";
import { FeedInfo, PodInfo, parsePlaylist } from "@/utils/playlist/server";
import { createFeed, createMedia } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import assert from "assert";
import Redis from "ioredis";
import { RedirectType, redirect } from 'next/navigation';
// import { Podcast } from "podcast";
assert(process.env['DB_REDIS_URL'], 'DB_REDIS_URL should be set');
const redis = new Redis(process.env['DB_REDIS_URL']);
export async function parseUrl(dataFrom: FormData) {
    'use server';
    // console.log(dataFrom);
    const targetUrl = dataFrom.get('url') as string;
    if (!targetUrl) {
        return Promise.reject(new Error('Invalid url'));
    }

    const url = new URL(targetUrl);
    const playlist_id = url.searchParams.get('list');
    if(!playlist_id) {
        throw new Error('Invalid url: no playlist');
    }
    // resolve(playlist_id);

    const supabase = createClient();

    const {
        data: { user }
    } = await supabase.auth.getUser();
    if (!user) {

        return await redirect('/signin');
    }

    const { data: userDetails } = await supabase
        .from('users')
        .select('*')
        .single();
    if(!userDetails) {
        console.warn('No user');
        throw (new Error('Invalid url: no user'));
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
            await redis.set(`pod:${feed_uuid}`, JSON.stringify(pod), 'EX', 180);
            for (const item of pod.items) {
                try {
                    // console.info('start uploading')
                    const media_id = await createMedia({
                        feed_id: feed_uuid,
                        title: item.title,
                        description: item.description,
                        cover: item.imageUrl || '',
                        author: item.author || 'unknown',
                        source: 'youtube',
                        guid: item.guid
                    });
                    // console.log(media_id, 'saved');
                    processYoutubeMediaUrl(item.guid, feed_uuid, media_id).then(async resp => {
                        if(resp.status !== 200) {
                            console.warn(media_id,resp.status, resp.statusText)
                            return;
                        }
                        await redis.sadd(`items:${feed_uuid}`, media_id);
                        await redis.expire(`items:${feed_uuid}`, 60 * 3);
                        // return resp.json();
                    }).catch(console.error);
                    // console.info('added media', media_id)
                } catch (ex) {
                    console.error(ex);
                }
            }

            // update feed with feed-items
        }
    } catch (err) {
        console.error(err)
        return null;
    }
    console.info('updated feed', `/feeds/${feed_uuid}`);
    redirect(`/feeds/${feed_uuid}`, RedirectType.push);
}