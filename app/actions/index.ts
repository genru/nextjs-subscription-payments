import { Feed, parsePlaylist } from "@/utils/playlist/server";
import { createFeed, createMedia } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { RedirectType, redirect } from 'next/navigation';
import { Podcast } from "podcast";
import { Readable } from "stream";
import ytstream from 'yt-stream';

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
    let feed;
    try {
        const pod: Podcast = await parsePlaylist(playlist_id) || '';

        const feedRaw: Feed = {
            title: pod.feed.title,
            description: pod.feed.description || '',
            cover: pod.feed.imageUrl || '',
            author: pod.feed.author || 'unknown',
            xml: pod.buildXml()
        };

        const feed_uuid = await createFeed(feedRaw, userDetails.id, 'youtube');
        if(feed_uuid) {
            for (const item of pod.items) {
                try {
                    const video =  await ytstream.stream(`https://www.youtube.com/watch?v=${item.guid}`, {
                        quality: 'high',
                        type: 'audio',
                        highWaterMark: 0,
                        download: true
                    });
                    console.log(video.video_url);
                    console.log(video.url);
                    // const resp = await fetch(video.url, {duplex: true});
                    if (video ){
                        const arr = await video.stream.toArray();
                        const arrBuffer = new Uint8Array(arr)
                        const ret = await createMedia(item.guid, arrBuffer, {
                            feed_id: feed_uuid,
                            title: item.title,
                            description: item.description,
                            cover: item.imageUrl || '',
                            author: item.author || 'unknown',
                            source: 'youtube'
                        });
                        console.log(ret);
                    }
                } catch (ex) {
                    console.error(ex);
                }
            }
        }
    } catch (err) {
        console.error(err)
        return null;
    }
    redirect(`/feeds/${feed}`, RedirectType.push);
}