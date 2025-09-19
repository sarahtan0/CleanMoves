import vid from './VideoPlayer.module.css'
import controls from './Controls.module.css';
import {useRef} from "react";
import ReactPlayer from "react-player";


import {VideoSettings} from "../VideoSettings/VideoSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGear, faPlay, faPause, faExpand, faCompress} from "@fortawesome/free-solid-svg-icons"
// import ReactPlayer from "react-player/youtube";
import { format } from 'date-fns';
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { useVideoPlayerData } from '../../controllers/useVideoPlayerData';

export function VideoPlayer(){
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<ReactPlayer>(null);

  const {
    url,setURL,
    openModal, setOpenModal,
    currSpeed, setCurrSpeed,
    isLooped,setIsLooped,
    countdownTime, setCountdownTime,
    inverted, setInverted,
    showTimeline, setShowTimeline,
    playing, setPlaying,
    isCountingDown, setIsCountingDown,
    currCountdownSecond, setCurrCountdownSecond,
    currTime,
    showVolume, setShowVolume,
    volume, setVolume,
    isMuted, setIsMuted,
    isFullScreen, setIsFullScreen,
    setStartSeconds,
    endMin, setEndMin,
    endSec, setEndSec,
    startMin, setStartMin,
    startSec, setStartSec,
    duration, setDuration,
    endSeconds, setEndSeconds,
    seekSeconds, setSeekSeconds,
    addTimeoutId,
    seek,
    toggleFullScreen,
    volumeIcon,
    handleProgress,
    handleMouseHover,
    zoom,
    setZoom,
    validUrl,
  } = useVideoPlayerData(videoRef);

  return (
    <div className={vid.centerContainer}>

      <div className={vid.container} ref={playerRef} id="container">
        {isCountingDown && 
            <div className={vid.countdownSecond}>
              <h1>{currCountdownSecond}</h1>
            </div>
        }
        {!isFullScreen &&
          <div style={{gap: "2vw", display: "flex", alignItems: "center", justifyContent: "center", marginBottom:"20px", width: "100%"}}>
              <input id={vid.url} onChange={e => {
                  setURL(e.target.value)
                  setPlaying(false)}}
                  placeholder="Paste YouTube Link"></input>
              {/* <div style={{gap:"0.5vw", display: "flex"}}>
                <button> SAVE</button>
                <button> LOAD </button>
              </div> */}
          </div>
        }
        {validUrl ? (
          <div className={vid.playerWrapper  + ' ' + (isFullScreen && vid.fullscreen) + ' ' + (inverted && vid.invert)} 
            onMouseMove={()=> handleMouseHover()} 
            onMouseLeave={()=>{
              setShowTimeline(false);
              setShowVolume(false);
            }}
            onClick={()=>setPlaying(!playing)}>
            <div style={{transform: `scale(${zoom})`}}>
              <ReactPlayer
                onReady={() => {
                  const dur = (videoRef.current?.getDuration() ?? 0) - 1;
                  setPlaying(false);
                  setDuration(dur);
                  setStartMin(0);
                  setStartSec(0);
                  setEndSeconds(dur);
                  setEndMin(Math.trunc(dur/60));
                  setEndSec(Math.floor((dur%60)));
                }}
                className={vid.player}
                url = {url}
                controls={ false }
                height = {isFullScreen ? "150vh" : "102vh"}
                width = {isFullScreen ? "100vw" : "68vw"}
                playbackRate={currSpeed}
                light={ false } 
                style={{ pointerEvents: "none" }}
                playing={ playing }
                onProgress={(vals) => handleProgress(vals)}
                ref={ videoRef }
                volume={isMuted ? 0 : volume/100}
              />
            </div>
          </div>
        ) : (
            <div className={vid.playerWrapper}>
              <p style={{ textAlign: "center" }}>ts not valid</p>
            </div>
          )
        }

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
                  <FontAwesomeIcon icon={playing ? faPause : faPlay} onClick={() => setPlaying((prevPlay : boolean) => !prevPlay)}/>
                </button>
                <div className={vid.timestamp}>
                  <p id={vid.currTime}>
                    {format(new Date(currTime / 100 * duration * 1000), "mm:ss")}
                    {" / "}
                    {format(new Date(duration * 1000), "mm:ss")}
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
            zoom={zoom}
            setZoom={setZoom}
          />
        </div>
        }
      </div>
    </div>
  );
}