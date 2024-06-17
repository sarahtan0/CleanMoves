import vid from './VideoPlayer.module.css'
import {useEffect, useRef, useState} from "react";
import ReactPlayer from "react-player";
import {VideoSettings} from "../VideoSettings/VideoSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGear} from "@fortawesome/free-solid-svg-icons"
import { Timeline } from "./Timeline/Timeline";

type VideoProps={
}

export function VideoPlayer({} : VideoProps) {
  const BASEURL = "https://www.youtube.com/watch?v=nzgUcGMR2QI&t=65s";

  const playerRef = useRef<HTMLDivElement>(null);
  const [url, setURL] = useState(BASEURL);
  const [openModal, setOpenModal] = useState(false);
  const [countdown, setCountdown] = useState(true);
  const [currSpeed, setCurrSpeed] = useState(1.0);
  const [isLooped, setIsLooped] = useState(false);
  const [countdownTime, setCountdownTime] = useState(0);
  const [inverted, setInverted] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  // TODO: make the size of the container adjustable to the window dimensions

  function resetURL() {
    if(url == ""){
      setURL(BASEURL)
    }
    return url;
  }

  return (
    <div className={vid.container} ref={playerRef}>
      
      <div className={vid.playerWrapper + ' ' + (inverted && vid.invert)} onMouseEnter={()=>setShowTimeline(true)} onMouseLeave={()=>setShowTimeline(false)}>
        <ReactPlayer 
          className={vid.player}
          url = {resetURL()}
          controls={false}
          width={1080}
          height={1080}
          playbackRate={currSpeed}
          light={false}
          style={{ pointerEvents: "none" }}
        />
      </div>
      {showTimeline &&
        <div className={vid.overlay} onMouseEnter={() => setShowTimeline(true)} onMouseLeave={()=>setShowTimeline(false)}>
          <div>
            <Timeline />
          </div>
          <div className={vid.inline}>
            <div>
              <button></button>
            </div>
            <div>
              <button className={vid.transparentButton} style={{ color: "white"}} onClick={() => setOpenModal(!openModal)}>
                <FontAwesomeIcon icon={faGear}/>
              </button>
              <button className={vid.transparentButton + ' ' + vid.mirror + ' ' + (inverted && vid.isMirrored)} onClick={() => setInverted(!inverted)} >Mirror</button>
              <button/>
            </div>
          </div>
        </div>
      }
      {openModal && 
      <div className={vid.modal}>
        <VideoSettings 
          setURL = {setURL}
          setOpenModal={setOpenModal}
          countdown={countdown}
          setCountdown={setCountdown}
          currSpeed={currSpeed}
          setCurrSpeed={setCurrSpeed}
          isLooped={isLooped}
          setIsLooped={setIsLooped}
          countdownTime={countdownTime}
          setCountdownTime={setCountdownTime}
        />
      </div>
      }
    </div>
  );
}