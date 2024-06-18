import vid from './VideoPlayer.module.css'
import {useEffect, useRef, useState} from "react";
import ReactPlayer from "react-player";
import {VideoSettings} from "../VideoSettings/VideoSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGear, faPlay, faPause, faExpand, faVolumeLow, faVolumeMute} from "@fortawesome/free-solid-svg-icons"
// import ReactPlayer from "react-player/youtube";
import { format } from 'date-fns';

type VideoProps={
}

export function VideoPlayer({} : VideoProps) {
  const BASEURL = "https://www.youtube.com/watch?v=cDQdR6i4W9o&list=PLcZxoPUYVQX2t6dT6PsSLo1j0Xbv7UBbd";

  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<ReactPlayer>(null);

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
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const timeoutRef = useRef<number | null> (null);

  // TODO: make the size of the container adjustable to the window dimensions

  const handleProgress = (time : any) => {
    setCurrTime(time.played * 100);
  }

  function seek(time : number){
    setCurrTime(time);
    if(videoRef.current?.getCurrentTime){
      videoRef.current?.seekTo(time / 100, "fraction");
    }
  }

  const handleMouseHover = () => {
    setShowTimeline(true);

    // checks if there's an existing timeoutRef (a previous mouse movement in the player div)
    // replaces it so there's no overlapping refs and the setTimeout function doesn't stack
    if(timeoutRef.current){
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
        setShowTimeline(false);
      }, 3000);
  }

  return (

    <div className={vid.container} ref={playerRef}>
      <div className={vid.playerWrapper + ' ' + (inverted && vid.invert)} onMouseMove={()=> handleMouseHover()} onMouseLeave={()=>setShowTimeline(true)}
        onClick={()=>setPlay(!play)}>
        <ReactPlayer 
          onReady={() => setPlay(false)}
          className={vid.player}
          url = {url}
          controls={ false }
          width= {1080}
          height={ 1080 }
          playbackRate={currSpeed}
          light={ false } 
          style={{ pointerEvents: "none" }}
          playing={ play }
          onProgress={(vals) => handleProgress(vals)}
          ref={ videoRef }
          volume={isMuted ? 0 : volume/100}
        />
      </div>

      {showTimeline &&
        <div className={vid.overlay} onMouseEnter={()=> setShowTimeline(true)} >
          <div className={vid.timeline}>
              <input type="range" className={vid.seeker} min="0" max="100" value={currTime} onChange={(e) => seek(parseInt((e.target as HTMLInputElement).value))}/>
          </div>
          <div className={vid.inline}>
            <div>
              <button className={vid.transparentButton + ' ' + vid.playButton}>
                <FontAwesomeIcon icon={play ? faPause : faPlay} onClick={() => setPlay(!play)}/>
              </button>
              <div className={vid.timestamp}>
                <p id={vid.currTime}>
                  {format(new Date(currTime / 100 * (videoRef.current?.getDuration()??0) * 1000), "mm:ss")}
                  {" / "}
                  {format(new Date((videoRef.current?.getDuration()??0) * 1000), "mm:ss")}
                </p>
              </div>
              <div className={vid.volume} onMouseEnter={() => setShowVolume(true)} onMouseLeave={() => setShowVolume(false)}>
                <div className={vid.volumeIcon} style={{color: "white"}} onClick={()=>setIsMuted(!isMuted)}>
                  <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeLow} />
                </div>
                {showVolume && 
                  <input type="range" min="0" max="100" value={volume} className={vid.volSlider} 
                  onInput={(event)=>{setVolume(parseInt((event.target as HTMLInputElement).value))}}></input>
                }
              </div>
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