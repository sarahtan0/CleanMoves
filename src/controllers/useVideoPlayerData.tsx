import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {faVolumeLow, faVolumeMute,faVolumeHigh} from "@fortawesome/free-solid-svg-icons"
import { OnProgressProps } from 'react-player/base';

export const useVideoPlayerData = (videoRef : React.RefObject<ReactPlayer>) => {
  const BASEURL = "https://www.youtube.com/watch?v=JKp80jCzho0";
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
  const [volume, setVolume] = useState(100);
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
  const timeoutRef = useRef<number | null> (null);
  const [zoom, setZoom] = useState(1);

  // seeks to that % of the video
  function seek(time : number){
    if(videoRef.current && videoRef.current?.seekTo){
      setCurrTime(time);
      videoRef.current?.seekTo(time / 100, "fraction");
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

  const volumeIcon = () => {
    if(volume == 0 || isMuted){
      return faVolumeMute;
    } else if (volume < 50){
      return faVolumeLow;
    } else {
      return faVolumeHigh;
    }
  }

  // converts to a fraction of the video
  const convertSeconds = (seconds : number) => {
    const dur = videoRef.current?.getDuration() ?? 0;
    return seconds / dur * 100;
  }

  const handleProgress = (time : OnProgressProps) => {
    setCurrTime(time.played*100);
    if(isLooped && playing && time.played > convertSeconds(endSeconds)/100){
      setCurrTime(() => {
        const startTime = convertSeconds(startSeconds);
        seek(startTime);
        return startTime;
      });
    } else {
      setCurrTime(time.played * 100);
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

  // changes isFullScreen when user presses escape from fullscreen mode
  useEffect(() => {
    const onFullScreenChange = () => document.fullscreenElement ? setIsFullScreen(true) : setIsFullScreen(false);
    const handleKeyDown = (event: KeyboardEvent) => {
      const seekTime = seekSeconds / (videoRef.current?.getDuration() ?? 1) * 100;
      switch(event.key){
        case " ":
          event.preventDefault();
          setPlaying(prevPlay => !prevPlay);
          break;
        case "ArrowLeft":
          setCurrTime(prev => {
            // you have to seek inside setCurrTime because state updates are put in a queue, 
            //so calling seek outside doesn't ensure it uses the most recent val
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
  }, [timeoutId, seekSeconds, isCountingDown, playing, videoRef])

  return {
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
    setZoom,
    zoom
  };

}