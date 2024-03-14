import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Grid from "@/components/ui/Feed/Grid";
import NavbarAction from "@/components/ui/Feed/NavbarAction";
import { createClient } from "@/utils/supabase/server";
import { Trash2, FilePlus, Music4 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Feeds() {
    // const router = useRouter();

    const supabase = createClient();

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
        .select('*, feedMedia(feed_id)').eq('user_id', user.id);

    if (error) {
        console.log(error);
    }

    // console.info(feeds)

    return (
        <section className="container m-auto px-4 w-full mb-32 py-8 sm:pt-8">
            <Breadcrumbs className="mb-4" paths={[{href:'/',title: 'Home'}, {title: 'My Feeds'}]}/>
            <Grid feeds={feeds} title="My Feeds"/>
        </section>
    )
}

