import { createClient } from '@/utils/supabase/server';
import { redirect } from "next/navigation";
import { Play, Shuffle } from "lucide-react";
import Card from "@/components/ui/Feed/Card";
import { FeedInfo } from '@/components/ui/Feed/FeedInfo';
import { getURL } from '@/utils/helpers';

export default async function Feed({params}:{params:{id:string}}) {

    // console.info(params.id);
    const supabase = await createClient();

    const channels = supabase.channel('custom-update-channel')
    .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'media' },
    (payload) => {
        console.log('Change received!', payload)
    }
    )
    .subscribe()

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/signin');
    }

    const { data: userDetails } = await supabase
      .from('users')
      .select('*')
      .single();

    const { data: feed, error } = await supabase
      .from('feeds')
      .select('*').eq('user_id', user.id).eq('uuid', params.id)
      .maybeSingle();

    if (error) {
      console.log(error);
    }

    if(!feed) {
        console.info('no feed found')
        return redirect('/');
    }

    const {data: mediaIds, error: feedError} = await supabase.from('feedMedia').select('media_id').eq('feed_id', feed.uuid);
    if (feedError) {
      console.warn(feedError, feedError && feedError.message);
      // console.error(`FeedMedia lookup failed: ${error}`);
      throw new Error(`FeedMedia lookup failed`);
    }
    const {data: medias, error: mediaError} = await supabase.from('media').select("*").in('id', mediaIds.map(i => i.media_id));
    if (mediaError) {
      console.warn(mediaError, mediaError && mediaError.message);
      // console.error(`Media lookup failed: ${mediaError}`);
      throw new Error(`Media lookup failed:`);
    }


    return (
        <section className="container relative m-auto flex overflow-hidden h-full">
            <FeedInfo title={feed.title}
                description={feed.description}
                cover={feed.cover}
                author={feed.author}
                rss={getURL(`feeds/${feed.uuid}/rss`)}/>
            <div className="flex flex-col items-start flex-grow-1 px-12 gap-3 mt-4 w-full overflow-y-scroll">
                {medias.map(i => (<Card title={i.title} description={i.author} audioSrc={i.url} cover={i.cover} key={i.url} />))}
            </div>
        </section>

    )
}