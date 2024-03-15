import { createClient } from '@/utils/supabase/server';
import { redirect } from "next/navigation";
import { ArrowDownWideNarrow, Cake, CalendarDays, Layers } from "lucide-react";
import { FeedInfo } from '@/components/ui/Feed/Detail/FeedInfo';
import { daysago, getURL } from '@/utils/helpers';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import CardList from '@/components/ui/Feed/Detail/CardList';

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
        <NavbarAction title={feed.title} episodes={medias.length} created={feed.created_at}/>
        <div className=" relative m-auto flex overflow-hidden">

            <FeedInfo title={feed.title}
                feed={feed}
                description={feed.description}
                cover={feed.cover}
                author={feed.author}
                rss={getURL(`feeds/${feed.uuid}/rss`)}/>
            <CardList medias={medias}/>
        </div>

        </section>

    )
}

function NavbarAction({...props}) {
    return (
        <div className="d-navbar h-4 min-h-8 mb-4">
        <div className="flex-1">
            <h2 className="text-2xl max-w-[680px]">{props.title}</h2>
            <div className="text-base-content font-extralight w-[26rem]">
                <ul className="d-menu pointer-events-none lg:d-menu-horizontal d-rounded-box rounded-xl">
                <li>
                    <div className='flex'>
                        <span className='invisible xl:visible'>Total episodes</span>
                        <span className=''><Layers width={18} height={18}/></span>
                        <span className="d-badge d-badge-sm d-badge-primary">{props.episodes}</span>
                    </div>
                </li>
                <li>
                    <div className="flex">
                        <span className='invisible xl:visible'>Created</span>
                        <span className=''><CalendarDays width={18} height={18}/></span>
                        <span className="d-badge d-badge-sm d-badge-primary">{daysago(props.created)}</span>
                    </div>
                </li>
                </ul>
            </div>
        </div>
        <div className="flex-none">
            <ul className="d-menu d-menu-horizontal px-1">
                <li className='invisible'><button><ArrowDownWideNarrow width={20} height={20}/></button></li>
                <li>
                    <details>
                        <summary>
                        <ArrowDownWideNarrow />
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