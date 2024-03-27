'use client'
import GridNavbarAction from "./NavbarAction";
import Card from "./Card";
import { FormEvent, useState } from "react";
import { handleRequest } from "@/utils/rss/client";
import { createFeedByYoutube } from "@/utils/rss/server";
import { useRouter } from "next/navigation";
import { getStatusRedirect, getURL } from "@/utils/helpers";
import RssDlg from "./RssDlg";
import { PlusCircle } from "lucide-react";

type Feed = { title: string; description: string; cover: string; uuid: string; created_at: string, summary: string}

export default function Grid({...props}) {
    const router = useRouter();
    const [isWorking, setIsWorking] = useState(false);
    const [rssLink, setRssLink] = useState('');

    const cards = props.feeds?.map((feed: Feed) => {
        const p = {feed: feed, title: feed.title}
        feed.summary = feed.description;
        return <Card key={feed.uuid} feed={feed} showRss={showRssDlg} />
    })

    function onSumbit(e:FormEvent<HTMLFormElement>) {
        console.log('grid submit',e);
        setIsWorking(true);
        handleRequest(e, createFeedByYoutube, router).then(() => {
            setIsWorking(false);
        });
    }

    function showRssDlg(uuid:string) {
        console.log('showRssDlg',uuid);
        setRssLink(getURL(`/feeds/${uuid}/rss`));
        const modal = document.querySelector('#modal_rss');
        // @ts-ignore
        modal?.showModal();
    }

    return (
        <>
        <GridNavbarAction title={props.title} onSubmit={onSumbit} />
        <div className="flex flex-wrap sm:flex-col lg:flex-row items-center gap-3">
            {cards}
            {isWorking && <LoadingCard/>}
            <PlaceHolderCard googleAuthUrl={props.googleAuthUrl}/>
        </div>

        <RssDlg rssLink={rssLink}/>
        </>
    )
}

function PlaceHolderCard({...props}) {
    const router = useRouter();
    const redirect_uri = getURL('/auth/google');
    function handleGoogleAuth(authorizationUrl: string=props.googleAuthUrl) {
        // const authorizationUrl = googleAuthUrl;
        try {
            const popup = window.open(authorizationUrl, "popup", "popup=true,height=550,width=500");
            let finished = false;
            const checkPopup = setInterval(() => {
                try {
                    // console.debug(popup?.window.location.href);
                if(popup?.window?.location.href.includes(redirect_uri)) {
                    popup.close();
                    finished = true;
                }
                if(!popup || !popup.closed) return;
                clearInterval(checkPopup);
                // setIsSubmitting(false);
                const redirectPath = finished ? getStatusRedirect('/feeds', 'Success!', 'Youtube are connected.')
                  :getStatusRedirect('/feeds', 'Oops!', 'User canncelled');
                router.push(redirectPath);
            } catch (err) {
                console.warn('ignore...', err);
            }
            },1000)

        } catch(err) {
            console.error('error caught:',err);
        }
    }
    return (
        <div className="d-card bg-base-200 w-96 h-60 p-2">
            <div className="d-card-body m-auto w-full flex items-center justify-center border-4 border-dashed rounded-2xl border-zinc-300 hover:border-zinc-400">
                <button className="d-btn d-btn-wide" onClick={() => handleGoogleAuth()}><PlusCircle/> Continue with Google</button>
                {/* <GoogleAuthButton></GoogleAuthButton> */}
                {/* <p className="text-xs flex-none text-center text-zinc-500">authorizate to access your youtube channel</p> */}
                <p className="text-xs flex-none text-center text-zinc-400">
                    By continuing, you confirm that the video you share to YouTube complies with YouTube’s&nbsp;<a className="underline" target="_blank" href="https://www.youtube.com/t/terms">Terms of Service</a>&nbsp;and does not infringe upon other people’s intellectual property rights and privacy. Check our&nbsp;<a className="underline" target="_blank" href="/legal/google-api-service-term">Google API Services Disclosure</a>.</p>
            </div>
        </div>
    )
}

function LoadingCard () {
    return (
        <div className="d-card d-card-compact w-96 h-60 hover:bg-base-100 shadow-xl d-image-full d-skeleton">
        <div className="d-card-body w-96 d-skeleton">
            <div className="flex-1">
                <h2 className="text-xl">making... </h2>
            </div>
            <p className="text-xs h-2 w-auto overflow-clip d-skeleton"></p>
            <p className="text-xs w-auto overflow-clip d-skeleton"></p>
            <div className="d-card-actions justify-end">
            </div>
        </div>
    </div>

    )
}

