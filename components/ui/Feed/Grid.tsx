import { Layers, Trash2 } from "lucide-react";
import Link from "next/link";

export default function Grid({...props}) {
    const cards = props.feeds?.map((feed: { title: string; description: string; cover: string; uuid: string; }) => {
        return <Card key={feed.uuid} title={feed.title} summary={feed.description} cover={feed.cover} id={feed.uuid}/>
    })

    return (
        <div className="flex items-center gap-3">
            {cards}
        </div>
    )
}

function Card({...props}) {
    return (
        <div className="d-card d-card-compact w-96 h-60 hover:bg-base-100 shadow-xl d-image-full group/item">
            <figure className="blur-lg invert odd:sepia overflow-clip"><img src={props.cover} alt="Shoes" /></figure>
            <div className="d-card-body w-96">
                {/* <h2 className="d-card-title">{props.title}</h2> */}
                <NavbarAction title={props.title}/>
                <p className="text-xs h-12 w-auto overflow-ellipsis overflow-clip">{props.summary}</p>
                <div>
                <ul className="inline-flex items-center gap-2 list-none *:flex *:items-center *:gap-1">
                    <li>
                        <Layers width={18} height={18}/> episodes
                        <span className="d-badge d-badge-sm d-badge-primary">{props.episodes || 6}</span>
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        update
                        <span className="d-badge d-badge-sm d-badge-outline d-badge-primary">1 day ago</span>
                    </li>

                </ul>
                </div>
                <div className="d-card-actions justify-end">
                    <Link href={`/feeds/${props.id}`} className="d-btn d-btn-primary d-btn-outline d-btn-sm">View</Link>
                </div>
            </div>
        </div>
    )
}

function NavbarAction({...props}) {
    return (
        <div className="d-navbar h-4 min-h-8 p-0 ">
            <div className="flex-1">
                <h2 className="text-lg">{props.title}</h2>
            </div>
            <div className="flex-none">
            <ul className="d-menu d-menu-horizontal d-rounded-box invisible group-hover/item:visible">
                <li className="d-tooltip" data-tip="delete this episode?">
                    <button>
                        <Trash2 className="text-error" width={18} height={18}/>
                    </button>
                </li>
            </ul>
                {/* <div className="d-dropdown d-dropdown-end">
                    <div tabIndex={0} role="button" className="d-btn  d-btn-xs d-btn-square d-btn-ghost m-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                    </div>
                    <ul tabIndex={0} className="d-dropdown-content z-[1] d-menu p-2 shadow bg-base-100 rounded-box w-32">
                        {props.menuItems}
                    </ul>
                </div> */}
            </div>
        </div>
    )
}