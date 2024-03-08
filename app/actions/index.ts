import { processYoutubeMediaUrl } from "@/utils/playlist/aws";
import { FeedInfo, PodInfo, parsePlaylist } from "@/utils/playlist/server";
import { createFeed, createMedia, createMedias } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import assert from "assert";
import Redis from "ioredis";
import { RedirectType, redirect } from 'next/navigation';
assert(process.env['DB_REDIS_URL'], 'DB_REDIS_URL should be set');
const redis = new Redis(process.env['DB_REDIS_URL']);
export async function parseUrl(dataFrom: FormData) {
    'use server';
    // console.log(dataFrom);
    console.time('parseUrl');
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
            const podKey = `pod:${feed_uuid}`;
            const itemsKey = `items:${feed_uuid}`;
            await redis.set(podKey, JSON.stringify(pod), 'EX', 180);

            // TODO: save items in one shot
            const ids = await createMedias(feed_uuid, pod.items.map(item => ({
                title: item.title,
                description: item.description,
                cover: item.itunesImage || '',
                author: item.author || 'unknown',
                source: 'youtube',
                guid: item.guid
            })));
            await redis.sadd(itemsKey, ids);
            await redis.expire(itemsKey, 60 * 3);
            for (let i = 0; i < ids.length; i++) {
                processYoutubeMediaUrl(pod.items[i].guid, feed_uuid, ids[i]).catch(console.error);
            }
            // for (const item of pod.items) {
            //     try {
            //         const media_id = await createMedia({
            //             feed_id: feed_uuid,
            //             title: item.title,
            //             description: item.description,
            //             cover: item.imageUrl || '',
            //             author: item.author || 'unknown',
            //             source: 'youtube',
            //             guid: item.guid
            //         });
            //         await redis.sadd(itemsKey, media_id);
            //         await redis.expire(itemsKey, 60 * 3);
            //         processYoutubeMediaUrl(item.guid, feed_uuid, media_id).catch(console.error);
            //     } catch (ex) {
            //         console.error(ex);
            //     }
            // }

            // update feed with feed-items
        }
    } catch (err) {
        console.error(err)
        return null;
    }
    console.info('updated feed', `/feeds/${feed_uuid}`);
    console.timeEnd('parseUrl');

    redirect(`/feeds/${feed_uuid}`, RedirectType.push);
}