import { getPreSignedUrl } from "@/utils/playlist/aws";
import { PodInfo } from "@/utils/playlist/server";
import { updateFeedWithXml, updateMediaWithUrl } from "@/utils/supabase/admin";
import assert from "assert";
import Redis from "ioredis";
import { Podcast } from "podcast";

assert(process.env['DB_REDIS_URL'], 'DB_REDIS_URL should be set');
const redis = new Redis(process.env['DB_REDIS_URL']);

export async function POST(request: Request, { params }: { params: { id: string } }) {

    try {
        const body = await request.json();
        const mediaId = params.id;
        console.log({...body, mediaId});
        const {url, feedId, guid} = body;
        const key = `items:${feedId}`;
        const exist = (1===await redis.exists(key));
        if(!exist) {
            return new Response();
        }
        const ismember = (1===await redis.sismember(key, mediaId));
        if(!ismember) {
            return new Response();
        }
        // const urlNew = await getPreSignedUrl(guid, 24 * 3600 * 7)
        const urlNew = `https://pub-0d979674586542a19e779286f94d5375.r2.dev/6R2UhhsabTc/${guid}`
        await updateMediaWithUrl(urlNew, mediaId)
        await updateMediaUrlInCache(feedId, urlNew, guid)
        await redis.srem(key, mediaId);
        const cnt = await redis.scard(key);
        console.log('cnt', cnt);
        if(cnt === 0) {
            // no more media expected
            await redis.del(key);
            await generateRssAndUpdateFeed(feedId);
        }
        // also update feed rss
    } catch (err) {
        console.log(err);
    }
    return new Response();
}

async function updateMediaUrlInCache(feedId: string, url: string, guid: string) {
    const key = `pod:${feedId}`;
    const exist = (1===await redis.exists(key));
    const txt = await redis.get(key);
    if(!exist || !txt) {
        return;
    }
    try {
        const pod = JSON.parse(txt) as PodInfo;
        const item = pod.items.find(i => i.guid === guid);
        if(!item) {
            return;
        }
        item.url =  url;
        item.enclosure && (item.enclosure.url = url) || (item.enclosure = {url: url, type:'audio/x-m4a', size:0});
        await redis.set(key, JSON.stringify(pod), 'EX', 180);
    } catch (err) {
        console.error(err);
    }
}

async function generateRssAndUpdateFeed(feedId: string) {
    const key = `pod:${feedId}`;
    const exist = (1===await redis.exists(key));
    if(!exist) {
        return;
    }
    try {
        const txt = await redis.get(key);
        if(txt) {
            const pod = JSON.parse(txt) as PodInfo;
            const rss = new Podcast(pod.feed);
            pod.items.forEach((item) => rss.addItem(item));
            await updateFeedWithXml(feedId, rss.buildXml());
            await redis.del(key);
        }
    } catch (err) {
        console.error(err);
    }
}