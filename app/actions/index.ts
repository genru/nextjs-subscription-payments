import { parsePlaylist } from "@/utils/playlist/server";
import { createFeed } from "@/utils/supabase/admin";

export async function parseUrl(dataFrom: FormData) {
    'use server';
    // console.log(dataFrom);
    const targetUrl = dataFrom.get('url') as string;
    if (!targetUrl) {
        return Promise.reject(new Error('Invalid url'));
    }
    return new Promise<string>(async (resolve, reject) => {
        const url = new URL(targetUrl);
        const playlist_id = url.searchParams.get('list');
        if(!playlist_id) {
            return reject(new Error('Invalid url: no playlist'));
        }
        // resolve(playlist_id);

        const data = await parsePlaylist(playlist_id) || '';
        const feed = await createFeed(data, '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');
        console.log(feed);
        resolve(data);
    })
}