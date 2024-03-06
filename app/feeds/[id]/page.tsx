import { createClient } from '@/utils/supabase/server';
import { redirect } from "next/navigation";
import { Play, Shuffle } from "lucide-react";
import Card from "@/components/ui/Feed/Card";

export default async function Feed({params}:{params:{id:string}}) {

    // console.info(params.id);
    const supabase = await createClient();
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
    // console.log(mediaIds);
    const {data: medias, error: mediaError} = await supabase.from('media').select("*").in('id', mediaIds.map(i => i.media_id));
    if (mediaError) {
      console.warn(mediaError, mediaError && mediaError.message);
      // console.error(`Media lookup failed: ${mediaError}`);
      throw new Error(`Media lookup failed:`);
    }
    // console.log(medias);

    return (
        <section className="container relative m-auto flex overflow-hidden h-full">
            <div className="w-96 h-full flex-shrink-0 overflow-y-auto overflow-x-hidden transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidenav">

                <div className="d-card d-card-compact w-96 bg-base-300 shadow-md rounded-2xl from-slate-800">
                    <figure>
                        <img src={feed.cover || 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'} alt={feed.title||undefined} />
                        {/* <Image src={feed.cover || 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'} alt={feed.title}  width={96} height={96}/> */}
                    </figure>
                    <div className="d-card-body bg-transparent">
                        <h2 className="d-card-title">{feed.title}!</h2>
                        <p className="text-xs">{feed.author}</p>
                        <div className="d-card-actions justify-center flex flex-row">
                            <button className="d-btn d-btn-sm d-btn-primary flex-grow-1 w-2/5 text-zinc-700 hover:text-white"> <Play width={16} height={16}></Play> Play</button>
                            <button className="d-btn d-btn-sm d-btn-secondary flex-grow-1 w-2/5 text-zinc-700 hover:text-gray-200"> <Shuffle width={16} height={16}></Shuffle> Shuffle</button>
                        </div>
                        <p className="text-neural py-8">{feed.description}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-start flex-grow-1 p-12 gap-2 w-full overflow-y-scroll">
                {medias.map(i => (<Card title={i.title} description={i.author} audioSrc={i.url}/>))}
            </div>
        </section>
    )
}