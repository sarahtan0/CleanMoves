import vid from './VideoPlayer.module.css'
import controls from './Controls.module.css';
import {useEffect, useRef, useState} from "react";
import ReactPlayer from "react-player";
import {VideoSettings} from "../VideoSettings/VideoSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGear, faPlay, faPause, faExpand, faVolumeLow, faVolumeMute, faCompress} from "@fortawesome/free-solid-svg-icons"
// import ReactPlayer from "react-player/youtube";
import { format } from 'date-fns';

export function VideoPlayer({}){

  const BASEURL = "";

  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<ReactPlayer>(null);
  const timeoutRef = useRef<number | null> (null);

  const [url, setURL] = useState(BASEURL);
  const [openModal, setOpenModal] = useState(false);
  const [currSpeed, setCurrSpeed] = useState(1.0);
  const [isLooped, setIsLooped] = useState(false);
  const [countdownTime, setCountdownTime] = useState(0);
  const [inverted, setInverted] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);

  // time is as a % of total video completed (ex: 10 = 10% of video is watched)
  const [currTime, setCurrTime] = useState(0);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleProgress = (time : any) => {
      setCurrTime(time.played * 100);
    }

    // changes isFullScreen when user presses escape from fullscreen mode
    useEffect(() => {
      const onFullScreenChange = () => document.fullscreenElement ? setIsFullScreen(true) : setIsFullScreen(false);
      if(!isCountingDown){
        document.addEventListener("fullscreenchange", onFullScreenChange);
        document.addEventListener("keydown", handleKeyDown);
      }

      return () => {
        document.removeEventListener("fullscreenchange", onFullScreenChange);
        document.removeEventListener("keydown", handleKeyDown);
      }
    }, [])

    const handleKeyDown = (event: KeyboardEvent) => {
      let seekTime = 5 / (videoRef.current?.getDuration() ?? 1) * 100;
      switch(event.key){
        case " ":
          event.preventDefault();
          setPlaying(prevPlay => !prevPlay);
          break;
          // you have to seek inside setCurrTime because state updates are put in a queue, so calling seek outside doesn't ensure it uses the most recent val
        case "ArrowLeft":
          setCurrTime(prev => {
            const newTime = prev - seekTime;
            seek(newTime);
            return newTime;
          });
          break;
        case "ArrowRight":
          setCurrTime(prev => {
            const newTime = prev + seekTime;
            seek(newTime);
            // returns the value it will seek to
            return newTime;
          })
          break;
        case "0":
          setCurrTime(() => {
            seek(0);
            return 0;
          })
          break;
        case "l":
          setCurrTime(prev => {
            const newTime = prev + 10 / (videoRef.current?.getDuration() ?? 1) * 100;
            seek(newTime);
            return newTime;
          })
          break;
        case "j":
          setCurrTime(prev => {
            const newTime = prev - 10 / (videoRef.current?.getDuration() ?? 1) * 100;
            seek(newTime);
            return newTime;
          })
          break;
        case "s":
          setOpenModal(prevModal => !prevModal);
          break;
        case "f":
          setIsFullScreen(prev => !prev);
          console.log(isFullScreen);
          toggleFullScreen();
          break;
        case "r":
          setInverted(prev => !prev);
          break;
        case "m":
          setIsMuted(prev => !prev);
          break;
        default:
          break;
      }
    }

    const toggleFullScreen = () => {
      if(document.fullscreenElement){
        setIsFullScreen(false);
        document.exitFullscreen();
      } else {
        const element = document.getElementById("container");
        element?.requestFullscreen();
        setIsFullScreen(true);
      }
    }

    // seeks to that % of the video
    function seek(time : number){
      if(videoRef.current && videoRef.current?.seekTo){
        setCurrTime(time);
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

        // waits 3 seconds before hiding the controls again
        timeoutRef.current = setTimeout(() => {
            setShowTimeline(false);
            }, 3000);
    }


  return (

    <div className={vid.container} ref={playerRef} id="container">
      <div className={vid.playerWrapper + ' ' + (inverted && vid.invert) + ' ' + (isFullScreen && vid.fullscreen)} 
        onMouseMove={()=> handleMouseHover()} 
        onMouseLeave={()=>setShowTimeline(false)}
        onClick={()=>setPlaying(!playing)}>
        
        <ReactPlayer 
          onReady={() => setPlaying(false)}
          className={vid.player}
          url = {url}
          controls={ false }
          width= {isFullScreen ? "100vw" : "66vw"}
          height={"150vh"}
          playbackRate={currSpeed}
          light={ false } 
          style={{ pointerEvents: "none" }}
          playing={ playing }
          onProgress={(vals) => handleProgress(vals)}
          ref={ videoRef }
          volume={isMuted ? 0 : volume/100}
        />
      </div>

      {showTimeline && 
        <div className={vid.overlay} onMouseEnter={()=> setShowTimeline(true)} >
          <div className={controls.timeline}>
              <input type="range" className={controls.seeker} min="0" max="100" value={currTime} onChange={(e) => seek(parseInt((e.target as HTMLInputElement).value))}/>
          </div>
          <div className={controls.inline}>
            <div>
              <button className={vid.transparentButton + ' ' + controls.playButton}>
                <FontAwesomeIcon icon={playing ? faPause : faPlay} onClick={() => setPlaying(prevPlay => !prevPlay)}/>
              </button>
              <div className={vid.timestamp}>
                <p id={vid.currTime}>
                  {format(new Date(currTime / 100 * (videoRef.current?.getDuration()??0) * 1000), "mm:ss")}
                  {" / "}
                  {format(new Date((videoRef.current?.getDuration()??0) * 1000), "mm:ss")}
                </p>
              </div>
              <div className={controls.volume} onMouseEnter={() => setShowVolume(true)} onMouseLeave={() => setShowVolume(false)}>
                <div className={controls.volumeIcon} style={{color: "white"}} onClick={()=>setIsMuted(!isMuted)}>
                  <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeLow} />
                </div>
                {showVolume && 
                  <input type="range" min="0" max="100" value={volume} className={controls.volSlider} 
                  onInput={(event)=>{setVolume(parseInt((event.target as HTMLInputElement).value))}}></input>
                }
              </div>
            </div>
            <div>
              <button className={vid.transparentButton + ' ' + vid.mirror + ' ' + (inverted && vid.isMirrored)} onClick={() => setInverted(!inverted)} >Mirror</button>
              <button className={vid.transparentButton} onClick={() => setOpenModal(!openModal)}>
                <FontAwesomeIcon icon={faGear}/>
              </button> 
              <button className={vid.transparentButton} 
                onClick={() => {
                  setIsFullScreen(!isFullScreen)
                  toggleFullScreen()}}>
                <FontAwesomeIcon icon={!isFullScreen ? faExpand : faCompress}/>
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
          currSpeed={currSpeed}
          setCurrSpeed={setCurrSpeed}
          isLooped={isLooped}
          setIsLooped={setIsLooped}
          countdownTime={countdownTime}
          setCountdownTime={setCountdownTime}
          setPlay={setPlaying}
          isFullScreen={isFullScreen}
          isCountingDown={isCountingDown}
          setIsCountingDown={setIsCountingDown}
        />
      </div>
      }
    </div>
  );
}