import React, { useState, useEffect } from "react";
import { getHost } from '../utils/utils-context';

const url = `${getHost()}/api/som/ding`;

var TIMER;

const useAudio = () => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
      playing ? audio.play() : audio.pause();
    },
    [playing]
  );

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

export default function Alarme() {

  const [playing, toggle] = useAudio();
  
  useEffect(() => { 
    
    let mounted = true;
    
    TIMER = setInterval(function(){
        if (!mounted) return;
        
        onTimer();

    }, 5000);

    return function cleanup() {
        
        mounted = false;

        setTimeout(() => {
            clearInterval(TIMER);
            TIMER = null;
        }, 1000);

    }

  },[]);

  const onTimer = () => {
    toggle();
  }
  
  return '';

}


  