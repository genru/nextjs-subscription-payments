import { parsePlaylist } from "@/utils/playlist/server";
import { createFeed } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

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

        const supabase = createClient();

        const {
          data: { user }
        } = await supabase.auth.getUser();

        const { data: userDetails } = await supabase
          .from('users')
          .select('*')
          .single();
        if(!userDetails) {
            console.warn('No user');
            return reject(new Error('Invalid url: no user'));
        }
        const data = await parsePlaylist(playlist_id) || '';
        const feed = await createFeed(data, userDetails.id, 'youtube');
        console.log(feed);
        resolve(data);
    })
}