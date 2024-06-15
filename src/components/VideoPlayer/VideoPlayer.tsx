import vid from './VideoPlayer.module.css'
import {useEffect, useRef, useState} from "react";
import ReactPlayer from "react-player";
import {VideoSettings} from "../VideoSettings/VideoSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGear} from "@fortawesome/free-solid-svg-icons"

type VideoProps={
}

export function VideoPlayer({} : VideoProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const [url, setURL] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [countdown, setCountdown] = useState(true);
  const [currSpeed, setCurrSpeed] = useState(1.0);
  const [isLooped, setIsLooped] = useState(false);
  const [countdownTime, setCountdownTime] = useState(0);
  const [inverted, setInverted] = useState(false);

  return (
    <div ref={playerRef}>
      {openModal && 
      <div>
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
      <div className={vid.player + ' ' + (inverted && vid.invert)}>
        <ReactPlayer 
          url = {url}
          controls={false}
          width={1080}
          height={1080}
          playbackRate={currSpeed}
          light={false}
          // style={{ pointerEvents: "none" }}
        />
      </div>
      <div>
        <button className={vid.transparentButton} style={{ color: "#3e4f57" }} onClick={() => setOpenModal(!openModal)}>
          <FontAwesomeIcon icon={faGear}/>
        </button>
        <button className={vid.transparentButton + ' ' + vid.mirror + ' ' + (inverted && vid.isMirrored)} onClick={() => setInverted(!inverted)} >Mirror</button>
      </div>
    </div>
  );
}