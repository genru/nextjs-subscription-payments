import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Grid from "@/components/ui/Feed/Grid";
import { createClient } from "@/utils/supabase/server";
import { Trash2, FilePlus, Music4 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Feeds() {
    // const router = useRouter();

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

    const { data: feeds, error } = await supabase
      .from('feeds')
      .select('*').eq('user_id', user.id);


    if (error) {
      console.log(error);
    }

    // console.info(feeds)
    return (
        <section className="container m-auto px-4 w-full mb-32 py-8 sm:pt-8">
            <Breadcrumbs className="mb-4" paths={[{href:'/',title: 'Home'}, {title: 'My Feeds'}]}/>
            <NavbarAction title="feeds"/>
            <Grid feeds={feeds}/>
        </section>
    )
}

function NavbarAction({...props}) {
    return (
        <div className="d-navbar h-4 min-h-8 mb-4">
            <div className="flex-1">
                <h2 className="text-2xl">My Feeds</h2>
            </div>
            <div className="flex-none">
            <ul className="d-menu d-menu-horizontal d-rounded-box">
                <li className="d-tooltip" data-tip="add new feeds">
                    <button className="d-btn-ghost d-btn d-btn-sm ">
                        <Music4 width={18} height={18}/>
                        New
                    </button>
                </li>
            </ul>
            </div>
        </div>
    )
}