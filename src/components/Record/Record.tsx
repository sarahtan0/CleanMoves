import cn from "./Record.module.css"
import { useRecordWebcam } from 'react-record-webcam'
import {useEffect, useState, useRef, CSSProperties} from "react"
import ReactPlayer from "react-player"
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import {motion, Variants, useAnimation} from 'framer-motion';
import btn from "./RecordButton.module.css";

export function Record(){
    const videoRef = useRef<ReactPlayer>(null);
    const { 
        createRecording, 
        openCamera, 
        startRecording, 
        stopRecording, 
        clearPreview,
        activeRecordings, 
    } = useRecordWebcam();

    const [recordingComponent, setRecordingComponent] = useState<any>(null);
    const [recording, setRecording] = useState(false);
    const [finishedRecording, setFinishedRecording] = useState(false);
    const [url, setUrl] = useState('https://www.youtube.com/watch?v=cDQdR6i4W9o');
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [playing, setPlaying] = useState(true);
    const videoElement = document.querySelector("#playback") as HTMLVideoElement;
    const [viewOnly, setViewOnly] = useState(false);

    const initCamera = async () => {
        const newRecording = await createRecording();
        // returns nothing if there is no id
        if(!newRecording?.id) return;
        setRecordingComponent(newRecording);
        await openCamera(newRecording.id);
    }

    useEffect(() => {
        initCamera();
    }, []);

    videoElement?.addEventListener("play", () => {
        console.log(videoElement.currentTime);
        videoRef.current?.seekTo((startTime + videoElement.currentTime), "seconds");
        setPlaying(true);
    })

    videoElement?.addEventListener("pause", () => {
        setPlaying(false);
    })

    const recordVideo = async () => {
        await openCamera(recordingComponent.id);
        await startRecording(recordingComponent.id);
        let time = 0;
        if(endTime - startTime > 0){
            time = (endTime - startTime)*1000;
        }
        await new Promise(resolve => setTimeout(resolve, time)); 
        stopVideo();
    };

    const stopVideo = async () => {
        setFinishedRecording(true);
        await stopRecording(recordingComponent.id);
        setPlaying(false);
        // await download(recording.id); // Download the recording
        setViewOnly(false);
    }

    const playAudio = () => {
        videoRef.current?.seekTo(startTime);
        setPlaying(true);
        setViewOnly(true);
    }

    const handleRecording = async () => {
        if(!recording){
            recordVideo();
            playAudio();
            setRecording(true);
        } else {
            stopVideo();
            setRecording(false);
        }
    }

    const newVideo = () => {
        clearPreview(recordingComponent.id);
        openCamera(recordingComponent.id);
        setFinishedRecording(false);
    }
    
    const loadVideo = async () => {
        setPlaying(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPlaying(false);
    }

    const convertToMin = (seconds: number) => {
        return String(Math.trunc(seconds/60)).padStart(2, '0');
    }

    const convertToSec = (seconds: number) => {
        return String(Math.trunc(seconds%60)).padStart(2,'0');
    }

    const innerCircleVariants: Variants = {
        circle: {
            transform: 'scale(1)',
            borderRadius: '100%'
        },
        square:{
            transform: 'scale(0.6)',
            borderRadius: '30%'
        }
    }


    const innerCircleAnimation = useAnimation();
    const outerCircleAnimation = useAnimation();
    return (
        <div>

            <div className={cn.topLine}>
                <input className={cn.url}
                placeholder="Paste YouTube Link"
                onChange={(link)=>{
                    setUrl(link.target.value);
                    }}></input>
            </div>
            <div className={cn.viewer}>
            {activeRecordings.map(recording => (
                <div>
                    <div key={recording.id}>
                        { !finishedRecording && 
                            <video className={cn.camera + ' ' + cn.flipped} ref={recording.webcamRef} autoPlay muted/>
                        }
                        { finishedRecording &&
                            <video className={cn.camera} id = "playback" ref={recording.previewRef} controls muted/>
                        }
                    </div>
                    <div className={cn.recordBtns}>
                        {!finishedRecording && 
                            <div className={btn.container}
                                onClick={handleRecording}
                                onMouseEnter={() => {
                                    innerCircleAnimation.start('square')
                                    outerCircleAnimation.start('thinCircle')
                                }}
                                onMouseLeave={() => {
                                    innerCircleAnimation.start('circle')
                                    outerCircleAnimation.start('circle')
                                }}
                            >
                                <div className={btn.circle + ' ' + btn.outerCircle}></div>
                                <motion.div 
                                    className={btn.circle + ' ' + btn.innerCircle}
                                    animate={innerCircleAnimation}
                                    variants={innerCircleVariants}
                                />
                            </div>
                        }
                        {finishedRecording &&
                            <button onClick={newVideo}>New Recording</button>
                        }
                    </div>
                </div>
            ))}
                <div className={cn.reactPlayer + ' ' + (viewOnly && cn.viewOnly)}>
                    <div>
                        <ReactPlayer 
                            ref={videoRef}
                            url={url}
                            controls={true}
                            height={"47vh"}
                            width={"45vw"}
                            onReady={() => {
                                setEndTime(videoRef.current?.getDuration()??0);
                                loadVideo();
                            }}
                            playing={playing}
                            light={false}
                        />
                    </div>
                    <div className={cn.bookmarkContainer}>
                        <div>
                            <button onClick={()=>setStartTime(videoRef.current?.getCurrentTime()??0)}>START</button>
                            <div className={cn.timestamp}>
                                <div className={cn.numberOutline}>
                                    {convertToMin(startTime)}
                                    {' ' + ':' + ' '}
                                    {convertToSec(startTime)}
                                </div>
                            </div>
                        </div>
                        <div>
                            <button onClick={()=>setEndTime(videoRef.current?.getCurrentTime()??0)}>END</button>
                            <div className={cn.timestamp}>
                                <div className={cn.numberOutline}>
                                    {convertToMin(endTime)}
                                    {' ' + ':' + ' '}
                                    {convertToSec(endTime)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}