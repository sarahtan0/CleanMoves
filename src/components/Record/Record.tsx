import cn from "./Record.module.css"
import { useRecordWebcam } from 'react-record-webcam'
import {useEffect, useState, useRef} from "react"
import ReactPlayer from "react-player"
import {motion, Variants, useAnimation} from 'framer-motion';
import btn from "./RecordButton.module.css";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    const [isRecording, setIsRecording] = useState(false);
    const [finishedRecording, setFinishedRecording] = useState(false);
    const [url, setUrl] = useState('https://www.youtube.com/watch?v=ESjayREZIFw');
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
        setFinishedRecording(true); // is there a way i can have this update after the animation
        await stopRecording(recordingComponent.id);
        await innerCircleAnimation.start('circle');
        setPlaying(false);
        setViewOnly(false);
    }

    const playAudio = () => {
        videoRef.current?.seekTo(startTime);
        setPlaying(true);
        // setViewOnly(true);
    }

    const handleRecording = async () => {
        if(!isRecording){
            setIsRecording(true);
            recordVideo();
            playAudio();
        } else {
            setIsRecording(false);
            stopVideo();
        }
    }

    const newVideo = () => {
        clearPreview(recordingComponent.id);
        openCamera(recordingComponent.id);
        setIsRecording(false);
        setFinishedRecording(false);
        setPlaying(false);
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
            transform: 'scale(0.5)',
            borderRadius: '20%'
        },
        shrink: {
            transform: 'scale(0.7)',
            borderRadius: '100%'
        },
        empty: {
            transform: 'scale(0)',
            borderRadius: '100%'
        }
    }

    const outerCircleVariants: Variants = {
        circle: {
            transform: 'scale(1)',
            borderRadius: '100%'
        },
        bigger: {
            transform: 'scale(1.3)',
            borderRadius: '100%'
        },
        medium: {
            transform: 'scale(1.2)',
            borderRadius: '100%'
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
                                onClick={() => {
                                    handleRecording();
                                    innerCircleAnimation.start('empty');
                                    outerCircleAnimation.start(['bigger', 'medium'], {
                                        repeat: Infinity,
                                        repeatType: 'mirror' 
                                    });
                                }}
                                onMouseEnter={() => {
                                    if(!isRecording){
                                        innerCircleAnimation.start('shrink')
                                        outerCircleAnimation.start('bigger')
                                    } else {
                                        innerCircleAnimation.start('square')
                                    }
                                }}
                                onMouseLeave={() => {
                                    if(!isRecording){
                                        innerCircleAnimation.start('circle')
                                        outerCircleAnimation.start('circle')
                                    } else {
                                        innerCircleAnimation.start('empty')
                                    }
                                }}
                            >
                                <motion.div 
                                    className={btn.circle + ' ' + btn.outerCircle}
                                    animate={outerCircleAnimation}
                                    variants={outerCircleVariants}
                                />
                                <motion.div 
                                    className={btn.circle + ' ' + btn.innerCircle}
                                    animate={innerCircleAnimation}
                                    variants={innerCircleVariants}
                                />
                            </div>
                        }
                        {finishedRecording &&
                            <button onClick={newVideo} style={{padding:"10px"}}>
                                <div className={cn.newBtn}>
                                    <AutorenewIcon/>
                                    <p>New Recording</p>
                                </div>
                            </button>
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
                        <div className={cn.startContainer}>
                            <h4 style={{whiteSpace: "nowrap", margin: "0px 0px 3px 0px"}}>Start Time</h4>
                            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <button className={cn.transparentBtn} onClick={()=>setStartTime(videoRef.current?.getCurrentTime()??0)}>
                                    <FontAwesomeIcon icon={faBookmark}/>
                                </button>
                                    <div className={cn.numberOutline}>
                                        {convertToMin(startTime)}
                                        {' ' + ':' + ' '}
                                        {convertToSec(startTime)}
                                    </div>
                            </div>
                        </div>
                        <div>
                            <div className={cn.endContainer}>
                                <h4 style={{whiteSpace: "nowrap", margin: "0px 0px 3px 0px"}}>End Time</h4>
                                <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <button className={cn.transparentBtn} onClick={()=>setEndTime(videoRef.current?.getCurrentTime()??0)}>
                                    <FontAwesomeIcon icon={faBookmark}/>
                                </button>
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
        </div>
    );
}