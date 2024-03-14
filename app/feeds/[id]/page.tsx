import { createClient } from '@/utils/supabase/server';
import { redirect } from "next/navigation";
import { Play, LayoutGrid, MoreVertical, ListOrdered, Sigma } from "lucide-react";
import Card from "@/components/ui/Feed/Detail/Card";
import { FeedInfo } from '@/components/ui/Feed/Detail/FeedInfo';
import { getURL } from '@/utils/helpers';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

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
        <section className='container m-auto px-4 w-full mb-32 py-8 sm:pt-8'>
        <Breadcrumbs className="mb-4" paths={[{href:'/',title: 'Home'}, {href:'/feeds', title: "My Feeds"}, {href:'#', title: feed.title}]}/>
        <NavbarAction title={feed.title}/>
        <div className=" relative m-auto flex overflow-hidden">

            <FeedInfo title={feed.title}
                description={feed.description}
                cover={feed.cover}
                author={feed.author}
                rss={getURL(`feeds/${feed.uuid}/rss`)}/>
            <div className="flex flex-col items-start flex-grow-1 px-12 gap-3 mt-4 w-full overflow-y-scroll">
                {medias.map(i => (<Card title={i.title} description={i.author} audioSrc={i.url} cover={i.cover} key={i.url} />))}
            </div>
        </div>

        </section>

    )
}

function NavbarAction({...props}) {
    return (
        <div className="d-navbar h-4 min-h-8 mb-4">
        <div className="flex-1">
            <h2 className="text-2xl">{props.title}</h2>
            <div className="text-base-content font-extralight">
                <ul className="d-menu pointer-events-none lg:d-menu-horizontal d-rounded-box rounded-xl">
                <li>
                    <div>
                    Total episodes
                    <span className="d-badge d-badge-md">18</span>
                    </div>
                </li>
                <li>
                    <div>
                    Last updates
                    <span className="d-badge d-badge-sm d-badge-neutral">2024-01-12</span>
                    </div>
                </li>
                </ul>
            </div>
        </div>
        <div className="flex-none">
            <ul className="d-menu d-menu-horizontal px-1">
                <li><button><LayoutGrid width={20} height={20}/></button></li>
                <li>
                    <details>
                        <summary>
                        <ListOrdered />
                        </summary>
                        <ul className="p-0 bg-base-100 rounded-t-none z-10 w-28">
                            <li><a>by Date</a></li>
                            <li><a>by Alphal</a></li>
                        </ul>
                    </details>
                </li>
            </ul>
        </div>
        </div>
    )
}