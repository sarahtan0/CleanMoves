import cn from "./PracticeHelp.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, SetStateAction, useState } from 'react';

type PracticeHelpProps = {
    setOpen: Dispatch<SetStateAction<boolean>>;

}

export function PracticeHelp({setOpen}: PracticeHelpProps){
    const [currTab, setCurrTab] = useState('func');

    const checkTab = (val: string) => {
        return currTab == val;
    }

    return(
       <div className={cn.background}>
        <div className={cn.container}>
            <div className={cn.tabs}>
                    <button id={cn.closeBtn} onClick={() => setOpen(false)}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                    <div className={(checkTab('func') ? cn.selected : cn.unselected)}
                    onClick={() => setCurrTab('func')}> Functions </div>
                    <div className={(checkTab('keybind') ? cn.selected : cn.unselected)}
                    onClick={() => setCurrTab('keybind')}> Keybinds </div>
            </div>

            <div className={cn.content}>
                {checkTab('func') && 
                <div className={cn.bulletPoints}>
                    <div>
                        <h3>Mirror</h3>
                        <ul>
                            <li> Click the Mirror button to flip the video</li>
                        </ul>
                    </div>
                    <div>
                        <h3>Settings</h3>
                        <ul>
                            <li> Open the settings using the settings button to access all features below</li>
                        </ul>
                    </div>
                    <div>
                        <h3>Countdown</h3>
                        <ul> 
                            <li> Set the seconds counted before resuming the video </li>
                            <li> Click the "Start Countdown" button to start the countdown </li>
                        </ul>
                    </div>
                    <div>
                        <h3>Speed</h3>
                        <ul>
                            <li> Click on the speed you want to set the video to </li>
                        </ul>
                    </div>
                    <div>
                        <h3>Loop</h3>
                        <ul>
                            <li>Skip the video to the timestamp you want to start the loop at</li>
                            <li>Click the bookmark button next to "Start" to bookmark the timestamp</li>
                            <li>Repeat with the end bookmark </li>
                            <li>Check the box next to "Loop" to enable looping</li>
                        </ul>
                    </div>
                    <div>
                        <h3> Skip Interval</h3>
                        <ul>
                            <li>Drag the slider to determine how many seconds the arrow keys skip by</li>
                        </ul>
                    </div>
                </div>
                }
                {checkTab('keybind') && 
                <div>
                    <div>
                        <h3>YouTube Keybinds</h3>
                        <div className={cn.table}>
                            <p>Left Arrow: Skip the video backwards the set seconds in settings</p>
                            <p>Right Arrow: Skip the video forwards the set seconds in settings</p>
                            <p>0: Skip back to the beginning of the video</p>
                            <p>L: Skip the video forward by 10 seconds</p>
                            <p>J: Skip the video backward by 10 seconds</p>
                            <p>S: Open settings</p>
                            <p>F: Enter or exit flil screen</p>
                            <p>R: Mirror video</p>
                            <p>M: Mute video</p>
                        </div>
                    </div>
                </div>
                }
            </div>
        </div>
       </div>
    );
}  