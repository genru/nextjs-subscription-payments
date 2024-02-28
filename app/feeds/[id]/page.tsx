import { findFeed } from "@/utils/supabase/admin";
import { createClient } from '@/utils/supabase/server';
import { redirect } from "next/navigation";
import Image from 'next/image'

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
            <div className="w-96 h-full flex-shrink-0 overflow-y-auto overflow-x-hidden border border-yellow-600 transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidenav">

                <div className="d-card d-card-compact w-96 bg-base-100 shadow-xl">
                    <figure>
                        <img src={feed.cover || 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'} alt="Shoes" />
                        {/* <Image src={feed.cover || 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'} alt={feed.title}  width={96} height={96}/> */}
                    </figure>
                    <div className="d-card-body">
                        <h2 className="d-card-title">{feed.title}!</h2>
                        <p>{feed.author}</p>
                        <div className="d-card-actions justify-start">
                        <button className="d-btn d-btn-sm d-btn-wide d-btn-primary">Play</button>
                        <button className="d-btn d-btn-sm d-btn-wide d-btn-secondary">Play</button>
                        </div>
                        <p>{feed.description}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center flex-grow-1 gap-2 w-full border border-red-500">
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