'use client'
import { Key, Suspense, useState } from "react";
import Card from "./Card";

export default function CardList({...props}) {

    const pageSize = 10
    const medias = props.medias;
    let lastLoadedMediaIndex = pageSize;
    const [mediaLoaded, setMediaLoaded] = useState(medias.slice(0, Math.min(pageSize, medias.length)));
    const [enableLoadBtn, setEnableLoadBtn] = useState(lastLoadedMediaIndex < medias.length);
    function loadNextPage() {
        console.info(`Loading next page`);
        if(!medias) {
            return;
        }
        const nextPage = medias.slice(lastLoadedMediaIndex, lastLoadedMediaIndex+Math.min(pageSize, medias.length-lastLoadedMediaIndex));
        const newMedia = mediaLoaded.concat(nextPage);
        setMediaLoaded(newMedia);
        lastLoadedMediaIndex += Math.min(pageSize, medias.length-lastLoadedMediaIndex);
        setEnableLoadBtn(lastLoadedMediaIndex < medias.length)
    }

    return (
        <div className="flex flex-col items-start flex-grow-1 px-12 gap-3 mt-4 w-full overflow-y-scroll">
            {mediaLoaded.map((i: { title: any; author: any; url: Key | null | undefined; cover: any; }) => (<Card title={i.title} description={i.author} audioSrc={i.url} cover={i.cover} key={i.url} />))}
            <button className='d-btn d-btn-outline d-btn-wide self-center' onClick={() => loadNextPage()} disabled={!enableLoadBtn}>{enableLoadBtn ? "load more":"no more episodes"}</button>
        </div>
    )
}