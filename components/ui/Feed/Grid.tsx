'use client'
import GridNavbarAction from "./NavbarAction";
import Card from "./Card";
import { FormEvent, useRef, useState } from "react";
import { handleRequest } from "@/utils/rss/client";
import { createFeedByYoutube } from "@/utils/rss/server";
import { useRouter } from "next/navigation";
import { getURL } from "@/utils/helpers";
import RssDlg from "./RssDlg";

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
        <><GridNavbarAction title={props.title} onSubmit={onSumbit} /><div className="flex flex-wrap sm:flex-col lg:flex-row items-center gap-3">
            {cards}
            {isWorking && <PlaceHoldCard/>}
        </div>

        <RssDlg rssLink={rssLink}/>
        </>
    )
}

function PlaceHoldCard () {
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

