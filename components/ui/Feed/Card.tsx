'use client'
import { Pause, Play, RefreshCw, AlertTriangle, Trash2 } from "lucide-react";
import AudioComponent from "./AudioComponent";
import { SyntheticEvent, useRef, useState } from "react";
import { cn } from "@/utils/cn";

export default function Card({...props}) {
    let audioCtrl = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    function onReady(e: any) {
        setIsLoaded(true);
        setDuration(e.duration);
    }
    function togglePlay() {
        if (isPlaying) {
            audioCtrl.current?.pause();
            setIsPlaying(false);
        } else {
            audioCtrl.current?.play();
            setIsPlaying(true);
        }
    }
    function seek(pos: number) {
        if(audioCtrl.current?.fastSeek) {
            console.log('fastSeek');
            audioCtrl.current?.fastSeek(pos * duration);
        }
        if(audioCtrl.current) {
            audioCtrl.current.currentTime = pos * duration;
        }
    }
    function updateTime(e: SyntheticEvent<HTMLAudioElement, Event>) {
        const audio: HTMLAudioElement = e.target as HTMLAudioElement;
        setCurrentTime(audio.currentTime);
    }

    function reloadMedia() {}
    const rootClassName = cn(
        "d-btn d-btn-sm d-btn-circle d-btn-neutral",
        {
          "d-btn-disabled": !isLoaded,
        },

    );
    const refreshButtonClassName = "d-btn d-btn-sm d-btn-circle d-btn-primary flex-grow-1"
    let badMedia = !props.audioSrc;
    return (
        <div className="flex flex-col min-w-full flow-grow-1 owerflow-auto my-0">
            <div className="d-card d-card-compact shadow-0 border-base-300 bg-base-100 group/item hover:bg-base-200">
            {/* <figure className=""><img src={props.cover} alt="Shoes" /></figure> */}
                <div className="d-card-body">
                    <div className="flex">
                        <figure className="w-20 rounded-sm ring ring-neutral ring-offset-base-100 ring-offset-2 mr-4"><img src={props.cover} alt="Album"/></figure>
                        <div className="flex flex-col w-full">
                            {/* <h2 className="d-card-title text-base font-normal">{props.title}</h2> */}
                            <NavbarAction title={props.title}/>
                            <p className="text-sm mt-1">{props.description}</p>
                        </div>
                    </div>
                    { badMedia && <p className="text-xs text-error flex items-center"><AlertTriangle height={12} width={12}/> <span className="ml-2">bad media</span></p>}
                    <div className="d-card-actions justify-end flex items-center">
                        <AudioComponent ref={audioCtrl} src={props.audioSrc} type={'audio/webm'} onReady={onReady} onTimeUpdate={(e)=>updateTime(e)}/>
                        <div className="text-xs">{formatTime(currentTime)}/{formatTime(duration)}</div>
                        <ProgressBar className="flex-grow" currentTime={currentTime} duration={duration} onClick={seek} />

                        {
                            badMedia ?  (<><button className={refreshButtonClassName} onClick={reloadMedia}><RefreshCw height={12} width={12}/></button></>) : (<button className={rootClassName} onClick={togglePlay}>
                                {isPlaying ? <Pause height={12} width={12}/> : <Play height={12} width={12}/>}
                            </button>)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

function formatTime(time: number) {
    const zeroPad = (num:number, places:number=2) => String(num).padStart(places, '0')
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = Math.floor(time % 60);
    if(hours) {
        return `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    } else {
        return `${zeroPad(minutes)}:${zeroPad(seconds)}`;
    }
}

function ProgressBar({...props}) {
    return (
        <div className="relative flex-grow h-3 mx-2 py-1" onClick={(e) => {props.onClick(e.nativeEvent.offsetX/(e.target as HTMLDivElement).clientWidth)}}>
            <div className="bg-base-300 h-1 rounded-lg" style={{ width: '100%'}} ></div>
            <div className="bg-accent h-1 rounded-lg absolute top-1 pointer-events-none" style={{ width: `${props.currentTime * 100 / props.duration}%` }} ></div>
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