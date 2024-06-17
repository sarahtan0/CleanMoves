import vid from './VideoPlayer.module.css'
import {useEffect, useRef, useState} from "react";
import ReactPlayer from "react-player";
import {VideoSettings} from "../VideoSettings/VideoSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGear, faPlay, faPause, faExpand} from "@fortawesome/free-solid-svg-icons"
import { Timeline } from "./Timeline/Timeline";
import YouTubePlayer from "react-player/youtube";
import { format } from 'date-fns';

type VideoProps={
}

export function VideoPlayer({} : VideoProps) {
  const BASEURL = "https://www.youtube.com/watch?v=cDQdR6i4W9o&list=PLcZxoPUYVQX2t6dT6PsSLo1j0Xbv7UBbd";

  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<YouTubePlayer>(null);

  const [url, setURL] = useState(BASEURL);
  const [openModal, setOpenModal] = useState(false);
  const [countdown, setCountdown] = useState(true);
  const [currSpeed, setCurrSpeed] = useState(1.0);
  const [isLooped, setIsLooped] = useState(false);
  const [countdownTime, setCountdownTime] = useState(0);
  const [inverted, setInverted] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [play, setPlay] = useState(false);

  const [currTime, setCurrTime] = useState(0);
  const [currSeconds, setCurrSeconds] = useState(0);

  // TODO: make the size of the container adjustable to the window dimensions

  const handleProgress = (time) => {
    setCurrTime(time.played * 100);
    console.log(play);
  }

  // converts from a % of the whole video to MM:SS format

  return (

    <div className={vid.container} ref={playerRef}>
      <div className={vid.playerWrapper + ' ' + (inverted && vid.invert)} onMouseEnter={()=>setShowTimeline(true)} onMouseLeave={()=>setShowTimeline(false)}
        onClick={()=>setPlay(!play)}>
        <ReactPlayer 
          onReady={() => setPlay(false)}
          className={vid.player}
          url = {url}
          controls={ false }
          width={ 1080 }
          height={ 1080 }
          playbackRate={currSpeed}
          light={ false } 
          style={{ pointerEvents: "none" }}
          playing={ play }
          onProgress={(vals) => handleProgress(vals)}
          ref={ videoRef }
        />
      </div>
      {showTimeline &&
        <div className={vid.overlay} onMouseEnter={() => setShowTimeline(true)} onMouseLeave={()=>setShowTimeline(false)}>
          <div className={vid.timeline}>
            <Timeline />
          </div>
          <div className={vid.inline}>
            <div>
              <button className={vid.transparentButton}>
                <FontAwesomeIcon icon={play ? faPause : faPlay} onClick={() => setPlay(!play)}/>
              </button>
              <p>
                {format(new Date(currTime / 100 * videoRef.current?.getDuration() * 1000), "mm:ss")}
              </p>
            </div>
            <div>
              <button className={vid.transparentButton + ' ' + vid.mirror + ' ' + (inverted && vid.isMirrored)} onClick={() => setInverted(!inverted)} >Mirror</button>
              <button className={vid.transparentButton} onClick={() => setOpenModal(!openModal)}>
                <FontAwesomeIcon icon={faGear}/>
              </button> 
              <button className={vid.transparentButton}>
                <FontAwesomeIcon icon={faExpand}/>
              </button>
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
          setPlay={setPlay}
        />
      </div>
      }
    </div>
  );
}