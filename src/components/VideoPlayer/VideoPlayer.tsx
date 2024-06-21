import vid from './VideoPlayer.module.css'
import controls from './Controls.module.css';
import {useEffect, useRef, useState} from "react";
import ReactPlayer from "react-player";
import {VideoSettings} from "../VideoSettings/VideoSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGear, faPlay, faPause, faExpand, faVolumeLow, faVolumeMute, faCompress, faVolumeHigh} from "@fortawesome/free-solid-svg-icons"
// import ReactPlayer from "react-player/youtube";
import { format } from 'date-fns';
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

export function VideoPlayer({}){

  const BASEURL = "";

  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<ReactPlayer>(null);
  const timeoutRef = useRef<number | null> (null);

  const [url, setURL] = useState(BASEURL);
  const [openModal, setOpenModal] = useState(false);
  const [currSpeed, setCurrSpeed] = useState(1.0);
  const [isLooped, setIsLooped] = useState(false);
  const [countdownTime, setCountdownTime] = useState(1);
  const [inverted, setInverted] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [currCountdownSecond, setCurrCountdownSecond] = useState(1);

  // time is as a % of total video completed (ex: 10 = 10% of video is watched)
  const [currTime, setCurrTime] = useState(0);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // this is formatted in % played already
  const [startSeconds, setStartSeconds] = useState(0);
  const [endMin, setEndMin] = useState(60);
  const [endSec, setEndSec] = useState(60);
  const [startMin, setStartMin] = useState(0);
  const [startSec, setStartSec] = useState(0);
  const [duration, setDuration] = useState(0);
  const [endSeconds, setEndSeconds] = useState(0);

  const [seekSeconds, setSeekSeconds] = useState(5);
  const seekSecondsRef = useRef(seekSeconds);

  const [timeoutId, addTimeoutId] = useState<number[]>([]);
    

  // converts to a fraction of the video
  const convertSeconds = (seconds : number) => {
    let dur = videoRef.current?.getDuration() ?? 0;
    return seconds / dur * 100;
  }

  const handleProgress = (time : any) => {
      if(isLooped && playing && time.played > convertSeconds(endSeconds)/100){
        setCurrTime(() => {
          let startTime = convertSeconds(startSeconds);
          seek(startTime);
          return startTime;
        });
      } else {
        setCurrTime(time.played * 100);
      }
    }

    // changes isFullScreen when user presses escape from fullscreen mode
    useEffect(() => {
      const onFullScreenChange = () => document.fullscreenElement ? setIsFullScreen(true) : setIsFullScreen(false);

        document.addEventListener("fullscreenchange", onFullScreenChange);
        document.addEventListener("keydown", handleKeyDown);

        // ensures that the new seekSeconds value is updated properly and there's no lag (because it's introducing a new value each time)
        // wouldn't need to do this if it modified the previous value
        seekSecondsRef.current = seekSeconds;
        if(isCountingDown && playing) {
          setIsCountingDown(false);
          timeoutId.forEach(timeout => clearTimeout(timeout));
        }

      return () => {
        document.removeEventListener("fullscreenchange", onFullScreenChange);
        document.removeEventListener("keydown", handleKeyDown);
      }
    }, [duration, endSeconds, seekSeconds, isCountingDown, playing])

    const handleKeyDown = (event: KeyboardEvent) => {
      let seekTime = seekSeconds / (videoRef.current?.getDuration() ?? 1) * 100;
        switch(event.key){
          case " ":
            event.preventDefault();
            setPlaying(prevPlay => !prevPlay);
            break;
          case "ArrowLeft":
            setCurrTime(prev => {
              // you have to seek inside setCurrTime because state updates are put in a queue, so calling seek outside doesn't ensure it uses the most recent val
              const newTime = prev - seekTime;
              if(newTime < 0){
                seek(0);
              } else {
                seek(newTime);
              }
              return newTime;
            });
            break;
          case "ArrowRight":
            setCurrTime(prev => {
              const newTime = prev + seekTime;
              if(newTime > 100){
                seek(100);
              } else {
                seek(newTime);
              }
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

    const volumeIcon = () => {
      if(volume == 0){
        return faVolumeMute;
      } else if (volume < 50){
        return faVolumeLow;
      } else {
        return faVolumeHigh;
      }
    }

  return (

    <div className={vid.container} ref={playerRef} id="container">
      {isCountingDown && 
          <div className={vid.countdownSecond}>
            <h1>{currCountdownSecond}</h1>
          </div>
      }
      <div className={vid.playerWrapper + ' ' + (inverted && vid.invert) + ' ' + (isFullScreen && vid.fullscreen)} 
        onMouseMove={()=> handleMouseHover()} 
        onMouseLeave={()=>{
          setShowTimeline(false);
          setShowVolume(false);
        }}
        onClick={()=>setPlaying(!playing)}>
        
        <ReactPlayer 
          onReady={() => {
            let dur = videoRef.current?.getDuration() ?? 0;
            setPlaying(false);
            setDuration(dur);
            setEndSeconds(dur);
            setEndMin(Math.trunc(dur/60));
            setEndSec(Math.trunc(dur%60));
          }}
          className={vid.player}
          url = {url}
          controls={ false }
          width= {isFullScreen ? "100vw" : "68vw"}
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
        <div className={vid.overlay} onMouseEnter={()=> setShowTimeline(true)} onMouseLeave={() => {setShowTimeline(false); setShowVolume(false);}}>
          <div className={controls.timeline}>
            <Box width="98%" display="flex" alignItems="center">
              <Slider min={0} max={100} value={currTime} onChange={(e) => seek(parseInt((e.target as HTMLInputElement).value))}
                sx={{
                  color: '#FFFFFF',
                  '& .MuiSlider-track': {
                    border: 'none',
                    color: '#FFFFFF'
                  },
                  '& .MuiSlider-thumb': {
                    color: '#FFFFFF', 
                    width: 15,
                    height: 15
                  },
                  '& .MuiSlider-rail': {
                    color: '#444444', 
                  },
              }}></Slider>
            </Box>
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
              <div className={controls.volume} onMouseEnter={() => setShowVolume(true)}>
                <div className={controls.volumeIcon} style={{color: "white"}} onClick={()=>setIsMuted(!isMuted)}>
                  <FontAwesomeIcon icon={volumeIcon()}/>
                </div>
                {showVolume && 
                  <Box width={90} display="flex" alignItems="center">
                    <Slider min={0} max={100} value={volume} onChange={(event)=>{setVolume(parseInt((event.target as HTMLInputElement).value))}}
                      sx={{
                        color: '#FFFFFF',
                        '& .MuiSlider-track': {
                          border: 'none',
                          color: '#FFFFFF'
                        },
                        '& .MuiSlider-thumb': {
                          color: '#FFFFFF', 
                          width: 15,
                          height: 15
                        },
                        '& .MuiSlider-rail': {
                          color: '#545454', 
                        },
                      }}/>
                  </Box>
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
          addTimeoutId={addTimeoutId}
          setCountdownSecond={setCurrCountdownSecond}
          duration={duration}
          currTime={currTime}
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
          setEndTime = {setEndSeconds}
          endTime = {endSeconds}
          setStartTime={setStartSeconds}
          endMin={endMin}
          endSec={endSec}
          setEndMin={setEndMin}
          setEndSec={setEndSec}
          startMin={startMin}
          startSec={startSec}
          setStartMin={setStartMin}
          setStartSec={setStartSec}
          setSeekSeconds={setSeekSeconds}
          play={playing}
          seekSeconds={seekSeconds}
        />
      </div>
      }
    </div>
  );
}