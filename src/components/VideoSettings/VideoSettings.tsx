import settings from "./VideoSettings.module.css";
import { Dispatch, SetStateAction, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBookmark } from '@fortawesome/free-solid-svg-icons'
import metronome from "./metronome.mp3";

type VideoSettingsProps = {
    setURL: (url : string) => void;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    currSpeed: number;
    setCurrSpeed: Dispatch<SetStateAction<number>>;
    isLooped: boolean;
    setIsLooped: Dispatch<SetStateAction<boolean>>;
    countdownTime: number;
    setCountdownTime: Dispatch<SetStateAction<number>>;
    setPlay: (play : boolean) => void;
    isFullScreen : boolean;
    isCountingDown : boolean;
    setIsCountingDown: Dispatch<SetStateAction<boolean>>;
    setEndTime : Dispatch<SetStateAction<number>>;
    endTime : number;
    setStartTime : Dispatch<SetStateAction<number>>;
    startMin : number;
    startSec : number;
    endMin : number;
    endSec : number;
    setStartMin : Dispatch<SetStateAction<number>>;
    setStartSec : Dispatch<SetStateAction<number>>;
    setEndMin : Dispatch<SetStateAction<number>>;
    setEndSec : Dispatch<SetStateAction<number>>;
    setSeekSeconds : Dispatch<SetStateAction<number>>;
    seekSeconds : number;
    currTime : number;
    duration : number;
}

export function VideoSettings({setURL, setOpenModal, currSpeed, setCurrSpeed, isLooped, setIsLooped,
    countdownTime, setCountdownTime, setPlay, isFullScreen, setEndTime, setStartTime, startMin, startSec, endMin, endSec, setStartMin, setStartSec,
    setEndMin, setEndSec, setSeekSeconds, seekSeconds, currTime, duration, endTime} : VideoSettingsProps) {
    
    const minRef = useRef(0);
    const secRef = useRef(0);
    const endRef = useRef(0);
    
    const tick = new Audio(metronome);

    function compareSpeed (checkSpeed : number) {
        return currSpeed == checkSpeed;
    }

    function countingDown() {
        const sound = (delay: number) => {
            setTimeout(() => {
              tick.play();
            }, delay);
          };
          
        if(countdownTime > 0){
            setOpenModal(false);
            setPlay(false);
            for (let i = 0; i < countdownTime; i++) {
                sound(i * 1000);
                if (i === countdownTime - 1) {
                setTimeout(() => {
                    setPlay(true);
                }, 1000 * countdownTime);
                }
            }
        }
    }

    // useEffect(() => {
    //     endRef.current = endTime;
    //   }, [endTime]);

    const convertToEnd = (time : number) => {
        let seconds = time / 100 * duration;
        let min = Math.trunc(seconds/60);
        let sec = Math.trunc(seconds % 60);
        let endStamp = convertFromStamps(min, sec);

        minRef.current = min;
        secRef.current = sec;
        endRef.current = endStamp;

        setEndMin(min);
        setEndSec(sec);
        setEndTime(endStamp);
    }

    const convertFromStamps = (min : number, sec : number) => {
        let convertedTime = (min * 60) + sec;
        return convertedTime;
    }

    return (
        <div className={settings.background + ' ' + (isFullScreen && settings.fullscreen)}>
            <div className={settings.container}>
                <div className={settings.title}>
                    <h2>Settings</h2>
                    <button onClick={() => setOpenModal(false)} id={settings.close}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                <div className={settings.body}>
                    <hr></hr>
                    <h3>YouTube Link</h3>
                    <div className={settings.section}>
                        <input onChange={e => {
                            setURL(e.target.value)
                            setPlay(false)}}
                            id={settings.url} placeholder="https://www.youtube.com"></input>
                    </div>
                    <hr></hr>
                    <h4>Countdown</h4>
                    <div className={settings.countdown+ ' ' + settings.section}>
                        <div>
                            <button className={settings.btn} onClick={()=> countingDown()}>Start Countdown</button>
                        </div>
                        <div className={settings.seconds}>
                            <input type="number" name="seconds" min="0" max="10" value={countdownTime} 
                                onChange={(e) => setCountdownTime(parseInt(e.target.value))}></input>
                            <label htmlFor="seconds"> seconds </label> 
                        </div>
                    </div>
                    <hr></hr>
                    <div className={settings.speed + ' ' + settings.section}>
                            <h4>Speed</h4>
                        <div className={settings.speeds}>
                            <button className={' ' + (compareSpeed(0.25) && settings.selected)} id={settings.leftSpeed} 
                                onClick={() => setCurrSpeed(.25)}> 0.25 </button>
                            <button className={' ' + (compareSpeed(0.5) && settings.selected)} id={settings.speedOption}
                                onClick={() => setCurrSpeed(.5)}> 0.5 </button>
                            <button className={' ' + (compareSpeed(0.75) && settings.selected)} id={settings.speedOption}
                                onClick={() => setCurrSpeed(.75)}> 0.75 </button>
                            <button className={' ' + (compareSpeed(1) && settings.selected)} id={settings.rightSpeed}
                                onClick={() => setCurrSpeed(1)}> 1 </button>

                        </div>
                        
                    </div>
                    <hr></hr>
                    <div className={settings.loop + ' ' + settings.section}>
                        <label htmlFor="loop" style={{fontWeight: "bold"}}> Loop</label>
                        <input type="checkbox" name="loop" checked={isLooped} onChange={(e) => setIsLooped(e.target.checked)}></input>
                        <div className={settings.startEnd}>
                            <div className={settings.start}>
                                <div className={settings.center + ' ' + settings.gap}>
                                    <p>Start</p>
                                    <button className={settings.transparentButton}>
                                        <FontAwesomeIcon icon={faBookmark}/>
                                    </button>
                                </div>
                                <div>
                                    <input type="number" className={settings.timeInput} value={startMin} placeholder="00" max="60" min="00" 
                                       onChange={(e) => {
                                        setStartMin(() => {
                                            let newMin = parseInt((e.target as HTMLInputElement).value);
                                            setStartTime(convertFromStamps(newMin, startSec));
                                            return newMin});
                                       }} ></input>
                                    :
                                    <input type="number" className={settings.timeInput} value={startSec} placeholder="00" max="60" min="0" 
                                    onChange={(e) => {
                                        setStartSec(() => {
                                            let newSec = parseInt((e.target as HTMLInputElement).value);
                                            setStartTime(convertFromStamps(startMin, newSec));
                                            return newSec});
                                       }}></input>
                                </div>
                            </div>
                            <div className={settings.end}>
                                <div className={settings.center + ' ' + settings.gap}>
                                    <p>End</p>
                                    <button className={settings.transparentButton} onClick={() => convertToEnd(currTime)}>
                                        <FontAwesomeIcon icon={faBookmark}/>
                                    </button>
                                </div>
                                <div>
                                    <input type="number" className={settings.timeInput} value={endMin} placeholder="60" max="60" min="0"></input>
                                    :
                                    <input type="number" className={settings.timeInput} value={endSec} placeholder="60" max="60" min="0"
                                    onChange={(e) => {
                                        setEndSec(() => {
                                            let newSec = parseInt((e.target as HTMLInputElement).value);
                                            setEndTime(convertFromStamps(endMin, newSec));
                                            return newSec});
                                       }}></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    <div>
                        <h4 className={settings.lessPad}>Seeking</h4>
                        <div>
                            <div className={settings.center}>
                                <p>seek by {seekSeconds} seconds</p>
                            </div>
                            <div className={settings.center}>
                                <input className={settings.slider} type="range" min="1" max="10" name="seekSeconds" value={seekSeconds}
                                    onChange={(e) => {
                                        setSeekSeconds(() => parseInt((e.target as HTMLInputElement).value));
                                    }}/>
                            </div>
                        </div>
                    </div>
                    <h1></h1>
                </div>
                
            </div>
        </div>
    );
}