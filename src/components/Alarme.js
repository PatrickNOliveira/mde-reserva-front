import React, { useState, useEffect } from "react";
import { getHost, getLogin } from '../utils/utils-context';
import api from '../services/api';
import alerta from '../utils/alertas';

const url = `${getHost()}/api/som/ding`;

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
  const [login] = useState(getLogin());

  var TIMER;

  var showingDialog = false;

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

    if (showingDialog) {
      toggle();
      return;
    }

    api.get(`/api/alarms/${login.uuid}`).then(response => {
      const data = response.data;
      if (data.length == 0) return;
      toggle();
      showingDialog = true;
      alerta({ 
        title: 'Atenção!',
        message: data.mensagem,
        onYes: () => {
          showingDialog = false;
        }
      });
    });    
  }
  
  return '';

}


  