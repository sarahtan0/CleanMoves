import cn from "./Record.module.css"
import { useRecordWebcam } from 'react-record-webcam'
import {useEffect, useState, useRef} from "react"

export function Record(){
    const { createRecording, openCamera, startRecording, stopRecording, download, activeRecordings} = useRecordWebcam();
    const [recording, setRecording] = useState<any>(null);
    const [finishedRecording, setFinishedRecording] = useState(false);

    useEffect(() => {
        const initCamera = async () => {
            const newRecording = await createRecording();
            // returns nothing if there is no id
            if(!newRecording?.id) return;
            setRecording(newRecording);
            await openCamera(newRecording.id);
        }

        initCamera();

    }, []);

    const recordVideo = async () => {
        await openCamera(recording.id);
        await startRecording(recording.id);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Record for 3 seconds
        setFinishedRecording(true);
        await stopRecording(recording.id);
        await download(recording.id); // Download the recording
    };
    
    return (
        <div>
            <div className={cn.topLine}>
                <input className={cn.url}
                placeholder="Paste YouTube Link"></input>
                <button>GEAR</button>
            </div>
            <div className={cn.viewer}>
            {activeRecordings.map(recording => (
                <div key={recording.id}>
                { !finishedRecording && 
                    <video className={cn.video} ref={recording.webcamRef} autoPlay />
                }
                { finishedRecording && 
                    <video className={cn.video} ref={recording.previewRef} width="-100vw" controls />
                }
                </div>
            ))}   
            </div>
            <div className={cn.recorder}>
                <button onClick={recordVideo}>Record Video</button>
            </div>
        </div>
    );
}