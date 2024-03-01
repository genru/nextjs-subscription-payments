import { findFeed } from "@/utils/supabase/admin";
import { createClient } from '@/utils/supabase/server';
import { redirect } from "next/navigation";
import Image from 'next/image'
import { Play, Shuffle } from "lucide-react";
import Card from "@/components/ui/Feed/Card";

export default async function Feed({params}:{params:{id:string}}) {

    console.info(params.id);
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
    return (
        <section className="container relative m-auto flex overflow-hidden h-full">
            <div className="w-96 h-full flex-shrink-0 overflow-y-auto overflow-x-hidden transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidenav">

                <div className="d-card d-card-compact w-96 bg-base-300 shadow-md rounded-2xl from-slate-800">
                    <figure>
                        <img src={feed.cover || 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'} alt="Shoes" />
                        {/* <Image src={feed.cover || 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'} alt={feed.title}  width={96} height={96}/> */}
                    </figure>
                    <div className="d-card-body bg-transparent">
                        <h2 className="d-card-title">{feed.title}!</h2>
                        <p className="text-xs">{feed.author}</p>
                        <div className="d-card-actions justify-center flex flex-row">
                            <button className="d-btn d-btn-sm d-btn-primary flex-grow-1 w-2/5 text-zinc-700 hover:text-white"> <Play width={16} height={16}></Play> Play</button>
                            <button className="d-btn d-btn-sm d-btn-secondary flex-grow-1 w-2/5 text-zinc-700 hover:text-gray-200"> <Shuffle width={16} height={16}></Shuffle> Shuffle</button>
                        </div>
                        <p>{feed.description}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-start flex-grow-1 p-12 gap-2 w-full overflow-y-scroll border border-red-500">
                <Card title="Card title!" description="Card description2" />
                <div className="flex flex-col flow-grow-1 owerflow-auto">
                    <div className="d-card w-96 bg-base-100 shadow-xl">
                    <div className="d-card-body">
                        <h2 className="d-card-title">Card title!</h2>
                        <p>If a dog chews shoes whose shoes does he choose?</p>
                        <div className="d-card-actions justify-end">
                        <button className="d-btn d-btn-primary">Buy Now</button>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="flex flex-col flow-grow-1 owerflow-auto">
                    <div className="d-card w-96 bg-base-100 shadow-xl">
                    <div className="d-card-body">
                        <h2 className="d-card-title">Card title!</h2>
                        <p>If a dog chews shoes whose shoes does he choose?</p>
                        <div className="d-card-actions justify-end">
                        <button className="d-btn d-btn-primary">Buy Now</button>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="flex flex-col flow-grow-1 owerflow-auto">
                    <div className="d-card w-96 bg-base-100 shadow-xl">
                    <div className="d-card-body">
                        <h2 className="d-card-title">Card title!</h2>
                        <p>If a dog chews shoes whose shoes does he choose?</p>
                        <div className="d-card-actions justify-end">
                        <button className="d-btn d-btn-primary">Buy Now</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    )
}