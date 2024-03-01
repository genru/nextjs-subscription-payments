'use client'
import { Pause, Play, StopCircle } from "lucide-react";
import AudioComponent from "./AudioComponent";
import { MouseEventHandler, SyntheticEvent, useRef, useState } from "react";
import { cn } from "@/utils/cn";

export default function Card({...props}) {
    let audioCtrl = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    function onReady(e: any) {
        // audioCtrl = audio;
        console.log(e.duration);
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
    const rootClassName = cn(
        "d-btn d-btn-sm d-btn-circle d-btn-primary text-neutral-content",
        {
          "d-btn-disabled": !isLoaded,
        },
        "flex-grow-1"
    );
    return (
        <div className="flex flex-col flow-grow-1 owerflow-auto ">
            <div className="d-card xxl:d-card-side min-w-96 bg-base-100 shadow-xl">
                <figure><img src={props.cover} alt="Album"/></figure>
            <div className="d-card-body">
                <h2 className="d-card-title from-stone-300">{props.title}</h2>
                <p>{props.description}</p>
                <div className="d-card-actions justify-end flex items-center">
                    <div className="text-xs">{formatTime(currentTime)}/{formatTime(duration)}</div>
                    <ProgressBar currentTime={currentTime} duration={duration} onClick={seek} />
                    {/* <input type="range" readOnly min={0} max={duration} value={currentTime} className="d-range d-range-xs" /> */}
                    <AudioComponent ref={audioCtrl} src={'https://cdn.listenbox.app/a/pO_zFgNFmW9.m4a'} type={'audio/mp3'} onReady={onReady} onTimeUpdate={(e)=>updateTime(e)}/>
                    <button className={rootClassName} onClick={togglePlay}>
                        {isPlaying ? <Pause height={12} width={12}/> : <Play height={12} width={12}/>}
                    </button>
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
        <div className="relative w-4/5 h-3 ml-2 m-auto py-1" onClick={(e) => {props.onClick(e.nativeEvent.offsetX/(e.target as HTMLDivElement).clientWidth)}}>
            <div className="bg-base-300 h-1 rounded-lg" style={{ width: '100%'}} ></div>
            <div className="bg-accent h-1 rounded-lg absolute top-1 pointer-events-none" style={{ width: `${props.currentTime * 100 / props.duration}%` }} ></div>
        </div>

    )
}