import cn from "./PracticeHelp.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, SetStateAction, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

type PracticeHelpProps = {
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export function PracticeHelp({setOpen}: PracticeHelpProps){
    const [currTab, setCurrTab] = useState('func');

    interface CustomAccordionProps {
        title: React.ReactNode,
        children: React.ReactNode
    }

    const CustomAccordion = ({title, children}: CustomAccordionProps) => {

        return (
            <Accordion 
                disableGutters
                sx = {{
                    boxShadow: 'none'
                }}
            >
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    sx = {{
                        flexDirection: 'row-reverse', // Reverse the direction to move the icon to the left
                        backgroundColor: '#ebf4f7'
                    }}
                >
                    {title}
                </AccordionSummary>
                <AccordionDetails
                    sx = {{
                        flexDirection: 'row-reverse', // Reverse the direction to move the icon to the left
                        backgroundColor: '#ebf4f7',
                        marginBottom: '0px',
                        marginTop: '0px'
                    }}
                >
                    {children}
                </AccordionDetails>
            </Accordion>
        );
    };

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
                <div className={cn.accordions}>
                    <CustomAccordion title={<h2>Mirror</h2>}>
                        <div>
                            <ul>
                                <li>Click the Mirror button to flip the video</li>
                            </ul>
                        </div>
                    </CustomAccordion>

                    <CustomAccordion title={<h2>Settings</h2>}>
                        <div>
                            <ul>
                                <li> Open the settings using the settings button to access all features below</li>
                            </ul>
                        </div>
                    </CustomAccordion>

                    <CustomAccordion title={<h2>Countdown</h2>}>
                        <div> 
                            <ul> 
                                <li> Set the seconds counted before resuming the video </li>
                                <li> Click the "Start Countdown" button to start the countdown </li>
                            </ul>
                        </div>
                    </CustomAccordion>

                    <CustomAccordion title={<h2>Speed</h2>}>
                        <div> 
                            <ul> 
                                <li> Click on the speed you want to set the video to </li>
                            </ul>
                        </div>
                    </CustomAccordion>

                    <CustomAccordion title={<h2>Loop</h2>}>
                        <div> 
                            <ul> 
                                <li>Skip the video to the timestamp you want to start the loop at</li>
                                <li>Click the bookmark button next to "Start" to bookmark the timestamp</li>
                                <li>Repeat with the end bookmark </li>
                                <li>Check the box next to "Loop" to enable looping</li>
                            </ul>
                        </div>
                    </CustomAccordion>

                    <CustomAccordion title={<h2>Skip Interval</h2>}>
                        <div> 
                            <ul> 
                                <li>Drag the slider to determine how many seconds the arrow keys skip by</li>
                            </ul>
                        </div>
                    </CustomAccordion>

                </div>
            </div>
        </div>
       </div>
    );
}  