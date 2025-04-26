import settings from "./VideoSettings.module.css";
import { Dispatch, SetStateAction, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBookmark } from '@fortawesome/free-solid-svg-icons'
import metronome from "./metronome.mp3";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

type VideoSettingsProps = {
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    currSpeed: number;
    setCurrSpeed: Dispatch<SetStateAction<number>>;
    isLooped: boolean;
    setIsLooped: Dispatch<SetStateAction<boolean>>;
    countdownTime: number;
    setCountdownTime: Dispatch<SetStateAction<number>>;
    setPlay: Dispatch<SetStateAction<boolean>>;
    play : boolean;
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
    setCountdownSecond : Dispatch<SetStateAction<number>>;
    addTimeoutId : Dispatch<SetStateAction<number[]>>; 
    setZoom : Dispatch<SetStateAction<number>>;
    zoom : number;
}

export function VideoSettings({setOpenModal, currSpeed, setCurrSpeed, isLooped, setIsLooped,
    countdownTime, setCountdownTime, setIsCountingDown, setPlay, isFullScreen, setEndTime, setStartTime, startMin, startSec, endMin, endSec, setStartMin, setStartSec,
    setEndMin, setEndSec, setSeekSeconds, seekSeconds, currTime, duration, setCountdownSecond, addTimeoutId, setZoom, zoom} : VideoSettingsProps) {
    
    const minRef = useRef(0);
    const secRef = useRef(0);
    const endRef = useRef(0);
    const startRef = useRef(0);
    
    const tick = new Audio(metronome);

    function compareSpeed (checkSpeed : number) {
        return currSpeed == checkSpeed;
    }

    function compareZoom(checkZoom : number) {
        return zoom == checkZoom;
    }

    function countingDown() {
        const sound = (delay: number) => {
            const timeoutId = setTimeout(() => {
            tick.play();
            setCountdownSecond(prev => prev-1);
            }, delay);
            addTimeoutId((prevIds) => prevIds.concat(timeoutId));
          };
          
        setOpenModal(false);
        setPlay(false);
        setIsCountingDown(true);
        setCountdownSecond(countdownTime+1);
        for (let i = countdownTime; i > 0; --i) {
            sound((i-1) * 1000);
            if (i === 1) {
            const timeoutId = setTimeout(() => {
                setPlay(true);
                setIsCountingDown(false);
            }, 1000 * countdownTime);
            addTimeoutId((prevIds) => prevIds.concat(timeoutId));
            }
        }
    }
      
    const convertToStart = (time : number) => {
        const seconds = time / 100 * duration;
        const min = Math.trunc(seconds/60);
        const sec = Math.trunc(seconds % 60);
        const startStamp = convertFromStamps(min, sec);

        minRef.current = min;
        secRef.current = sec;
        startRef.current = startStamp;

        setStartMin(min);
        setStartSec(sec);
        setStartTime(startStamp);
    }

    const convertToEnd = (time : number) => {
        const seconds = time / 100 * duration;
        const min = Math.trunc(seconds/60);
        const sec = Math.trunc(seconds % 60);
        const endStamp = convertFromStamps(min, sec);

        minRef.current = min;
        secRef.current = sec;
        endRef.current = endStamp;
        
        setEndMin(min);
        setEndSec(sec);
        setEndTime(endStamp);
    }

    const convertFromStamps = (min : number, sec : number) => {
        const convertedTime = (min * 60) + sec;
        return convertedTime;
    }

    const doubleDigit = (val : number) => {
        if (val >= 10){
            return val;
        } else {
            return '0' + val;
        }
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
                    <h4>Countdown</h4>
                    <div className={settings.countdown+ ' ' + settings.section}>
                        <div>
                            <button className={settings.btn} onClick={()=> countingDown()}>Start Countdown</button>
                        </div>
                        <div className={settings.seconds}>
                            <input type="number" name="seconds" min="1" max="10" value={countdownTime} 
                                onChange={(e) => setCountdownTime(parseInt(e.target.value))}></input>
                            <label htmlFor="seconds"> seconds </label> 
                        </div>
                    </div>
                    <hr></hr>
                    <div className={settings.speed + ' ' + settings.section}>
                        <h4>Speed</h4>
                        <h5>Custom: {currSpeed} </h5>
                        <div>
                            <Slider max={2} min={0} aria-label="Volume" value={currSpeed} step={0.05} onChange={(e,v) => {
                                setCurrSpeed((v as number));
                            }}
                            sx={{
                                color: '#FFFFFF',
                                '& .MuiSlider-track': {
                                    border: 'none',
                                    color: '#9cb2ba'
                                },
                                '& .MuiSlider-thumb': {
                                    color: '#FFFFFF', 
                                },
                                '& .MuiSlider-rail': {
                                    color: '#CCCCCC', 
                                },
                                }}
                            />
                        </div>
                        <div className={settings.speeds}>
                            <button className={' ' + (compareSpeed(0.25) ? settings.selected : settings.unselected)} id={settings.leftSpeed} 
                                onClick={() => setCurrSpeed(.25)}> 0.25 </button>
                            <button className={' ' + (compareSpeed(0.5) ? settings.selected : settings.unselected)} id={settings.speedOption}
                                onClick={() => setCurrSpeed(.5)}> 0.5 </button>
                            <button className={' ' + (compareSpeed(0.75) ? settings.selected : settings.unselected)} id={settings.speedOption}
                                onClick={() => setCurrSpeed(.75)}> 0.75 </button>
                            <button className={' ' + (compareSpeed(1) ? settings.selected : settings.unselected)} id={settings.rightSpeed}
                                onClick={() => setCurrSpeed(1)}> 1 </button>

                        </div>
                        
                    </div>
                    <hr></hr>
                    <div className={settings.speed + ' ' + settings.section}>
                            <h4>Zoom</h4>
                        <div className={settings.speeds}>
                            <button className={' ' + (compareZoom(1) ? settings.selected : settings.unselected)}
                                 id={settings.leftSpeed} onClick={() => setZoom(1)}> 1x </button>
                            <button className={' ' + (compareZoom(1.25) ? settings.selected : settings.unselected)} 
                                onClick={() => setZoom(1.25)} id={settings.speedOption}> 1.25x </button>
                            <button className={' ' + (compareZoom(1.5) ? settings.selected : settings.unselected)} 
                                onClick={() => setZoom(1.5)} id={settings.speedOption}> 1.5x </button>
                            <button className={' ' + (compareZoom(1.75) ? settings.selected : settings.unselected)} 
                                onClick={() => setZoom(1.75)} id={settings.speedOption}> 1.75x </button>
                            <button className={' ' + (compareZoom(2) ? settings.selected : settings.unselected)} 
                                onClick={() => setZoom(2)} id={settings.rightSpeed}> 2x </button>

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
                                    <button className={settings.transparentButton} onClick={() => convertToStart(currTime)}>
                                        <FontAwesomeIcon icon={faBookmark}/>
                                    </button>
                                </div>
                                <div>
                                    <input type="number" className={settings.timeInput} value={doubleDigit(startMin)} placeholder="00" max="60" min="00"></input>
                                    :
                                    <input type="number" className={settings.timeInput} value={doubleDigit(startSec)} placeholder="00" max="60" min="0" 
                                    onChange={() => convertToStart(currTime)}></input>
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
                                    <input type="number" className={settings.timeInput} value={doubleDigit(endMin)} placeholder="60" max="60" min="0"></input>
                                    :
                                    <input type="number" className={settings.timeInput} value={doubleDigit(endSec)} placeholder="60" max="60" min="0"></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    <div>
                        <h4 className={settings.lessPad}>Skip Interval</h4>
                        <div>
                            <div className={settings.center}>
                                <p>Skip by {seekSeconds} seconds</p>
                            </div>
                            <div className={settings.center}>
                                <Box width={200} display="flex" alignItems="center">
                                    <Slider max={10} min={1} aria-label="Volume" value={seekSeconds} onChange={(e) => {
                                        setSeekSeconds(parseInt((e.target as HTMLInputElement).value));}} 
                                    sx={{
                                        color: '#FFFFFF',
                                        '& .MuiSlider-track': {
                                          border: 'none',
                                          color: '#9cb2ba'
                                        },
                                        '& .MuiSlider-thumb': {
                                          color: '#FFFFFF', 
                                        },
                                        '& .MuiSlider-rail': {
                                          color: '#CCCCCC', 
                                        },
                                      }}/>
                                </Box>
                            </div>
                        </div>
                    </div>
                    <h1></h1>
                </div>
                
            </div>
        </div>
    );
}