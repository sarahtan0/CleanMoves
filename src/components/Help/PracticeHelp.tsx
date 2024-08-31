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
                    boxShadow: 'none',
                }}
            >
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    sx = {{
                        flexDirection: 'row-reverse', // Reverse the direction to move the icon to the left
                        backgroundColor: '#ebf4f7',
                        padding: '8px 16px', // Adjust padding as needed
                    }}
                >
                    {title}
                </AccordionSummary>
                <AccordionDetails
                    sx = {{
                        flexDirection: 'row-reverse', // Reverse the direction to move the icon to the left
                        backgroundColor: '#ebf4f7',
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
                {checkTab('func') &&
                <div className={cn.accordions}>
                        <CustomAccordion title={<h2>Video Player</h2>}>
                            <div className={cn.function}>
                                <ul>
                                    <li>The 'Mirror' button will flip your video horizontally so you can learn whichever way feels best</li>
                                    <li>The gear opens a pop up screen that contains all the features of this site</li>
                                </ul>
                                <img width={"40%"} src="images/mirror.png"></img>

                            </div>
                        </CustomAccordion>

                        <CustomAccordion title={<h2>Countdown</h2>}>
                            <div className={cn.function}>
                                <p className={cn.caption}>Set the countdown time from 1 to 10 seconds and click 'Start Countdown' to immediately
                                    start counting down.</p> 
                                <img width={"40%"} src="images/countdown.png"></img>

                            </div>
                        </CustomAccordion>

                        <CustomAccordion title={<h2>Speed</h2>}>
                            <div className={cn.function}> 
                                <p className={cn.caption}>Clicking each number will change the video speed to that respective value.</p>
                                <img width={"40%"} src="images/speed.png"></img>
                            </div>
                        </CustomAccordion>

                        <CustomAccordion title={<h2>Loop</h2>}>
                            <div className={cn.function}> 
                                <p className={cn.caption}>Click the bookmark buttons while the video player timestamp is at the time you want to
                                    start or end the the loop at and click the 'Start' or 'End' bookmarks. Once you
                                    check the box next to 'Loop' your video will only play within those timestamps.
                                </p>
                                <img width={"40%"} src="images/loop.png"></img>

                            </div>
                        </CustomAccordion>

                        <CustomAccordion title={<h2>Skip Interval</h2>}>
                            <div className={cn.function}> 
                                <p className={cn.caption}>Drag the slider to determine how many seconds the arrow keys skip the video by.</p>
                                <img width={"40%"} src="images/skip.png"></img>
                                
                            </div>
                        </CustomAccordion>
                </div>
                    }
            </div>
        </div>
       </div>
    );
}  