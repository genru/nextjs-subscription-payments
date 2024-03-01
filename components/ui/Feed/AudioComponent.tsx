import { cn } from "@/utils/cn";
import { AudioHTMLAttributes, ReactEventHandler, forwardRef, useRef } from "react";
import { mergeRefs } from "react-merge-refs";

interface Props extends AudioHTMLAttributes<HTMLAudioElement> {
    // variant?: 'slim' | 'flat';
    onReady?: Function;
    onPlay?: ReactEventHandler<HTMLAudioElement>;
    onEnded?: ReactEventHandler<HTMLAudioElement>;
    onTimeUpdate?: ReactEventHandler<HTMLAudioElement>;
    onSeeked?: ReactEventHandler<HTMLAudioElement>;
    onSeeking?: ReactEventHandler<HTMLAudioElement>;
    onCanPlay?: ReactEventHandler<HTMLAudioElement>;
    onCanPlayThrough?: ReactEventHandler<HTMLAudioElement>;
    onWaiting?: ReactEventHandler<HTMLAudioElement>;
    onPlaying?: ReactEventHandler<HTMLAudioElement>;
    active?: boolean;
    width?: number;
    loading?: boolean;
    src: string;
    type: string;
    Component?: React.ComponentType;
}

const AudioComponent = forwardRef<HTMLAudioElement, Props>((props, audioRef) => {
    const {
        onReady,
        onPlay,
        onEnded,
        onTimeUpdate,
        onSeeked,
        onSeeking,
        onCanPlay,
        onCanPlayThrough,
        onWaiting,
        onPlaying,
        style,
        className,
        children,
        active,
        width,
        loading,
        src,
        type,
        Component = 'audio',
        ...rest
    } = props;

    const ref = useRef(null);
    // const rootClassName = cn()
    const rootClassName = cn(
        className
    );
    return (
        <Component
            controls={false} preload="metadata"
            onLoadedMetadata={(e)=> onReady && onReady(e.target)}
            onPlay={(e)=> onPlay && onPlay(e)}
            onEnded={(e)=> onEnded && onEnded(e)}
            onTimeUpdate={(e)=> onTimeUpdate && onTimeUpdate(e)}
            onSeeked={(e)=> onSeeked && onSeeked(e)}
            onSeeking={(e)=> onSeeking && onSeeking(e)}
            onCanPlayThrough={(e)=> onCanPlayThrough && onCanPlayThrough(e)}
            onCanPlay={(e) => onCanPlay && onCanPlay(e)}

            ref={mergeRefs([ref, audioRef])}
            className={rootClassName}
            {...rest}
        >
            {children}
            <source
            id="audio-player"
        //   name="audio-player"
            src={src}
            type={type}
            />
            {/* Fallback content */}
            Your browser does not support the audio element.
        </Component>
    );
});
AudioComponent.displayName = 'Audio Component';

export default AudioComponent;


// function AudioComponent({onReady}) {
//     function onMetaLoaded({target}:{target: any}) {
//         console.log(target)
//         onReady(target)
//     }

//     return (
//         <div>
//       <audio controls preload="metadata" onLoadedMetadata={onMetaLoaded} onCanPlay={() => console.log('can play')}>
//         <source
//           id="audio-player"
//         //   name="audio-player"
//           src={'https://cdn.listenbox.app/a/pO_zFgNFmW9.m4a'}
//           type="audio/mp3"
//         />
//         {/* Fallback content */}
//         Your browser does not support the audio element.
//       </audio>
//     </div>
//     )
// }