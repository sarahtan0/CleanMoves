import settings from "./VideoSettings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons'

// PARENT COMPONENT  
// TODO : create start and end timestamps for loops 

type VideoSettingsProps = {
    setURL: (url : string) => void;
    setOpenModal: (openModal : boolean) => void;
    countdown: boolean;
    setCountdown: (countdown : boolean) => void;
    currSpeed: number;
    setCurrSpeed: (currSpeed : number) => void;
    isLooped: boolean;
    setIsLooped: (isLooped : boolean) => void;
    countdownTime: number;
    setCountdownTime: (countdownTime: number) => void;
    setPlay: (play : boolean) => void;
    isFullScreen : boolean;
}

export function VideoSettings({setURL, setOpenModal, countdown, setCountdown, currSpeed, setCurrSpeed, isLooped, setIsLooped,
    countdownTime, setCountdownTime, setPlay, isFullScreen} : VideoSettingsProps) {

    function countdownBox(boxElem: React.ChangeEvent<HTMLInputElement>) {
        if(boxElem.target.checked){
            setCountdown(true);
        } else {
            setCountdown(false);
        }
    }

    function compareSpeed (checkSpeed : number) {
        return currSpeed == checkSpeed;
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
                    <div className={settings.countdown+ ' ' + settings.section}>
                        <div>
                            <input type="checkbox" name="countdown" checked={countdown} onChange={(e) => countdownBox(e)}></input>
                            <label htmlFor="countdown" style={{fontWeight: "bold"}}> Countdown</label>
                        </div>
                        <div className={(!countdown && settings.grayed)+ ' ' + settings.seconds}>
                            <input type="number" name="seconds" min="0" max="10" value={countdownTime} 
                                onChange={(e) => setCountdownTime(parseInt(e.target.value))}></input>
                            <label htmlFor="seconds"> seconds </label> 
                        </div>
                    </div>
                    <hr></hr>
                    <div className={settings.speed + ' ' + settings.section}>
                            <label htmlFor="speed" style={{fontWeight: "bold"}}>Speed </label>
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
                        <input type="checkbox" name="loop" checked={isLooped} onChange={(e) => setIsLooped(e.target.checked)}></input>
                        <label htmlFor="loop" style={{fontWeight: "bold"}}> Loop</label>
                        <div className={settings.startEnd + ' ' + (!isLooped && settings.grayed)}>
                            <div className={settings.start}>
                                <div>
                                    <p>Start</p>
                                </div>
                                <div>
                                    <input type="number" className={settings.timeInput} placeholder="00" max="60" min="00"></input>
                                    :
                                    <input type="number" className={settings.timeInput}placeholder="00" max="60" min="0"></input>
                                </div>
                            </div>
                            <div className={settings.end}>
                                <div>
                                    <p>End</p>
                                </div>
                                <div>
                                    <input type="number" className={settings.timeInput}placeholder="00" max="60" min="0"></input>
                                    :
                                    <input type="number" className={settings.timeInput}placeholder="00" max="60" min="0"></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}