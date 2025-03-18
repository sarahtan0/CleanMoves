import cn from "./PracticeHelp.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import mirror from "images/mirror.png";

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

    interface KeybindProps {
        keybind: React.ReactNode,
        children: React.ReactNode
    }

    const Keybind = ({keybind, children}: KeybindProps) => {
        return(
            <div className={cn.table}>
                <div style={{textAlign: "left"}}>
                    {children}  
                </div>
                <div className={cn.key}>
                    <p style={{fontSize: "20px"}}>
                        {keybind}
                    </p>
                </div>
            </div>
        );
    }

    interface TitleProps {
        description: React.ReactNode
    }

    const Title = ({description}: TitleProps) => {
        return(
            <div>
                <p style={{fontStyle: "italic", color: "gray", marginBottom: "0px", marginTop: "30px"}}> {description} </p>
                <hr></hr>
            </div>
        )
    }

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
                                    <img width={"40%"} src={mirror}></img>

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
                {checkTab('keybind') &&
                    <div className={cn.keybindContainer}>
                        <Title description={"General"}/>
                        <Keybind keybind={"h"}>
                            <p>Open help window</p>
                        </Keybind>
                        <Keybind keybind={"s"}>
                            <p>Open settings window</p>
                        </Keybind>

                        <Title description={"Video Skipping"}/>
                        <div className={cn.table}>
                            <div style={{textAlign: "left"}}>
                                <p>Skip or rewind by number of seconds set by user</p>
                            </div>
                            <div style={{display: "flex", gap: "5px"}}>
                                <div className={cn.key}>
                                    <FontAwesomeIcon icon={faCaretLeft}/>
                                </div>
                                <div className={cn.key}>
                                    <FontAwesomeIcon icon={faCaretRight}/>
                                </div>
                            </div>
                        </div>
                        <div className={cn.table}>
                            <div style={{textAlign: "left"}}>
                                <p>Skip or rewind video by 10 seconds</p>
                            </div>
                            <div style={{display: "flex", gap: "5px"}}>
                                <div className={cn.key}>
                                    <p>j</p>
                                </div>
                                <div className={cn.key}>
                                    <p>l</p>
                                </div>
                            </div>
                        </div>
                        <Keybind keybind={"0"}>
                            <p>Rewind to beginning of video</p>
                        </Keybind>

                        <Title description={"General Video"}/>
                        <Keybind keybind={"r"}>
                            <p>Mirror video</p>
                        </Keybind>
                        <Keybind keybind={"m"}>
                            <p>Mute video</p>
                        </Keybind>
                        <div className={cn.table}>
                            <div style={{textAlign: "left"}}>
                                <p>Play/Pause video</p>
                            </div>
                            <div className={cn.key} style={{padding: "3px", width: "6vw"}}>
                                <p style={{fontSize: "20px"}}>
                                    space
                                </p>
                            </div>
                        </div>

                        <div style={{height: "30px"}}>
                        </div>
                    </div>
                }
            </div>
        </div>
       </div>
    );
}  