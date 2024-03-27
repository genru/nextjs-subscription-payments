'use client'
import { handleRequest } from "@/utils/rss/client";
import { daysago } from "@/utils/helpers";
import { removeFeedByUuid } from "@/utils/rss/server";
import { CalendarDays, Layers,Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";


export default function Card({...props}) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const feed = props.feed;
    function onDelete(uuid: string) {
        console.info("onDelete", uuid);
        setIsDeleting(true);
        const formData = new FormData();
        formData.append('uuid', uuid);
        handleRequest(formData, removeFeedByUuid).then(() => {
            setIsDeleting(false);
        });
    }

    return (
        <div className="d-card d-card-compact w-96 h-60 hover:bg-base-100 shadow-xl d-image-full group/item">
            <figure className="blur-lg invert odd:sepia overflow-clip"><img src={feed.cover} alt={feed.title} /></figure>
            <div className="d-card-body w-96">
                {/* <h2 className="d-card-title">{feed.title}</h2> */}
                <NavbarAction title={feed.title} uuid={feed.uuid} onDelete={onDelete} disableDelete={isDeleting} />
                <p className="text-xs h-12 w-auto overflow-ellipsis overflow-clip line-clamp-6">{feed.summary}</p>
                <div>
                <ul className="inline-flex items-center gap-2 list-none *:flex *:items-center *:gap-1">
                    <li>
                        <Layers width={18} height={18}/> episodes
                        <span className="d-badge d-badge-sm d-badge-primary">{feed.feedMedia?.length || 0}</span>
                    </li>
                    <li>
                        <CalendarDays width={18} height={18}/>
                        created
                        <span className="d-badge d-badge-sm d-badge-outline d-badge-primary">{daysago(feed.created_at)}</span>
                    </li>

                </ul>
                </div>
                <div className="d-card-actions justify-end">
                    <button className="d-btn d-btn-secondary d-btn-outline d-btn-sm" onClick={() => props.showRss(feed.uuid)}>RSS</button>
                    <Link href={`/feeds/${feed.uuid}`} className="d-btn d-btn-primary d-btn-outline d-btn-sm">View</Link>
                </div>
            </div>
        </div>
    )
}

// @ts-ignore
function NavbarAction({title, uuid, onDelete, disableDelete}) {
    return (
        <div className="d-navbar h-4 min-h-8 p-0 ">
            <div className="flex-1" >
                <div className="d-tooltip text-left" data-tip={title}>
                    <h2 className="text-lg leading-5 line-clamp-2">{title}</h2>
                </div>
            </div>
            <div className="flex-none">
                {disableDelete ? (
                    <ul className="d-menu d-menu-horizontal d-rounded-box visible">
                    <li className="d-tooltip" data-tip="deleting...">
                        <button className="d-btn d-btn-ghost d-btn-circle d-btn-disabled d-btn-sm">
                            <span className="d-loading d-loading-spinner text-primary"></span>
                        </button>
                    </li>
                </ul>
                ) : (
                    <ul className="d-menu d-menu-horizontal d-rounded-box invisible group-hover/item:visible">
                    <li className="d-tooltip" data-tip="delete this episode?">
                        <button className="d-btn d-btn-ghost d-btn-circle d-btn-sm" onClick={() => onDelete(uuid)}>

                            <Trash2 className="text-error" width={18} height={18}/>
                        </button>
                    </li>
                </ul>
                )}

            </div>
        </div>
    )
}