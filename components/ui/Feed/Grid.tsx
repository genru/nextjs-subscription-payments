'use client'
import GridNavbarAction from "./NavbarAction";
import Card from "./Card";
import { FormEvent, useState } from "react";
import { handleRequest } from "@/utils/rss/client";
import { createFeedByPlaylist } from "@/utils/rss/server";
import { useRouter } from "next/navigation";

type Feed = { title: string; description: string; cover: string; uuid: string; created_at: string}

export default function Grid({...props}) {
    const router = useRouter();
    const [isWorking, setIsWorking] = useState(false);
    const cards = props.feeds?.map((feed: Feed) => {
        const p = {feed: feed, title: feed.title}
        return <Card key={feed.uuid} feed={feed} />
    })

    function onSumbit(e:FormEvent<HTMLFormElement>) {
        console.log('grid submit',e);
        setIsWorking(true);
        handleRequest(e, createFeedByPlaylist, router).then(() => {
            setIsWorking(false);
        });
    }
    return (
        <><GridNavbarAction title={props.title} onSubmit={onSumbit} /><div className="flex items-center gap-3">
            {cards}
            {isWorking && <PlaceHoldCard/>}
        </div></>
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