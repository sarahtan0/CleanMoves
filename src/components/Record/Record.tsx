import cn from "./Record.module.css"
import VideoRecorder from 'react-video-recorder'

export function Record(){
    return (
        <div>
            <div className={cn.recorder}>
                <VideoRecorder
                    
                />
            </div>
        </div>
    );
}