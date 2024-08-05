import cn from "./Record.module.css"
import { useRecordWebcam } from 'react-record-webcam'
import {useEffect, useState, useRef} from "react"
import ReactPlayer from "react-player"

export function Record(){
    const videoRef = useRef<ReactPlayer>(null);
    const { createRecording, openCamera, startRecording, stopRecording, download, activeRecordings} = useRecordWebcam();
    const [recording, setRecording] = useState<any>(null);
    const [finishedRecording, setFinishedRecording] = useState(false);
    const [url, setUrl] = useState('https://www.youtube.com/watch?v=lDRkALaSjzU');
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const initCamera = async () => {
            const newRecording = await createRecording();
            // returns nothing if there is no id
            if(!newRecording?.id) return;
            setRecording(newRecording);
            await openCamera(newRecording.id);
            console.log(recording.id);
        }

        initCamera();

    }, []);

    const recordVideo = async () => {
        await openCamera(recording.id);
        await startRecording(recording.id);
        let time = 0;
        if(endTime - startTime > 0){
            time = (endTime - startTime)*1000;
        }
        await new Promise(resolve => setTimeout(resolve, time)); // Record for 3 seconds
        stopVideo();
    };

    const stopVideo = async () => {
        setFinishedRecording(true);
        await stopRecording(recording.id);
        await download(recording.id); // Download the recording
    }

    const playAudio = () => {
        videoRef.current?.seekTo(startTime);
        setPlaying(true);
    }
    
    return (
        <div>
            <div className={cn.topLine}>
                <input className={cn.url}
                placeholder="Paste YouTube Link"
                onChange={(link)=>setUrl(link.target.value)}></input>
                <button>GEAR</button>
            </div>
            <div className={cn.viewer}>
            {activeRecordings.map(recording => (
                <div key={recording.id}>
                    { !finishedRecording && 
                        <video className={cn.camera + ' ' + cn.flipped} ref={recording.webcamRef} autoPlay />
                    }
                    { finishedRecording && 
                        <video className={cn.camera} ref={recording.previewRef} controls />
                    }
                </div>
            ))}
                <div className={cn.reactPlayer}>
                    <ReactPlayer 
                        ref={videoRef}
                        url={url}
                        controls={true}
                        height={"47vh"}
                        width={"45vw"}
                        onReady={() => {
                            setEndTime(videoRef.current?.getDuration()??0);
                        }}
                        playing={playing}
                    />
                </div>
            </div>
            <div className={cn.recordBookmark}>
                <div className={cn.recorder}>
                    <button onClick={() => {
                        recordVideo();
                        playAudio();
                        }
                    }>
                        Record Video</button>
                    <button onClick={stopVideo}>Stop Recording</button>
                    <button>New Recording</button>
                </div>
                <div className={cn.bookmarkContainer}>
                    <div>
                        <button onClick={()=>setStartTime(Math.trunc(videoRef.current?.getCurrentTime()??0))}>START</button>
                        {startTime}
                    </div>
                    <div>
                        <button onClick={()=>setEndTime(Math.trunc(videoRef.current?.getCurrentTime()??0))}>END</button>
                        {endTime}
                    </div>
                </div>
            </div>
        </div>
    );
}