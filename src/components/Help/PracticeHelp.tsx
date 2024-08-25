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
                <div>
                    <div>
                        <h3>Countdown</h3>
                        <li> 
                            <ul> Set the seconds counted before resuming the video </ul>
                            <ul> Click the "Start Countdown" button to start the countdown </ul>
                        </li>
                    </div>
                    <div>
                        <h3>Speed</h3>
                        <li>
                            <ul> Click on the speed you want to set the video to </ul>
                        </li>
                    </div>
                    <div>
                        <h3>Loop</h3>
                        <li>
                            <ul>Skip the video to the timestamp you want to start the loop at</ul>
                            <ul>Click the bookmark button next to "Start" to bookmark the timestamp</ul>
                            <ul>Skip the video to the timestamp you want to end the loop at</ul>
                            <ul>Click the bookmark button next to "End" to bookmark the timestamp</ul>
                            <ul>Check the box next to "Loop" to enable looping</ul>
                        </li>
                    </div>
                    <div>
                        <h3> Skip Interval</h3>
                        <li>
                            <ul>Drag the slider to determine how many seconds the arrow keys skip by</ul>
                        </li>
                    </div>
                </div>
                }
                {checkTab('keybind') && 
                <div>
                    <div>
                        <h3>YouTube Keybinds</h3>
                        <li>
                            <ul></ul>
                        </li>
                    </div>
                </div>
                }
            </div>
        </div>
       </div>
    );
}  