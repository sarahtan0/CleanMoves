import cn from "./Record.module.css"
import { useRecordWebcam } from 'react-record-webcam'
import {useEffect, useState, useRef} from "react"
import ReactPlayer from "react-player"

export function Record(){
    const { createRecording, openCamera, startRecording, stopRecording, download, activeRecordings} = useRecordWebcam();
    const [recording, setRecording] = useState<any>(null);
    const [finishedRecording, setFinishedRecording] = useState(false);
    const [url, setUrl] = useState('https://www.youtube.com/watch?v=lDRkALaSjzU');
    const videoRef = useRef<ReactPlayer>(null);

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
        // await new Promise(resolve => setTimeout(resolve, 3000)); // Record for 3 seconds
    };

    const stopVideo = async () => {
        setFinishedRecording(true);
        await stopRecording(recording.id);
        await download(recording.id); // Download the recording
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
                    />
                </div>
            </div>
            <div className={cn.recorder}>
                <button onClick={recordVideo}>Record Video</button>
                <button onClick={stopVideo}>Stop Recording</button>
                <button>New Recording</button>
            </div>
        </div>
    );
}