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
  return '';
}
function Alarme2() {

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

  const notifyAlarmReceived = (alarm) => {
    api.post(`/api/alarm/${login.uuid}/${alarm.suite}/${alarm.funcionario}`).then(response => {
    });
  }
  
  const getEmployee = (alarm) => {
    if (alarm.funcionario == 0) return '';
    return alarm.nome.trim().toUpperCase() + ', ';
  };

  const getMessage = (alarm) => {
    return  alarm.mensagem.toLowerCase();
  };

  const showAlarmDialog = (alarm) => {
    showingDialog = true;
    const message = getEmployee(alarm) + getMessage(alarm);
    toggle();
    alerta({ 
      title: alarm.suite > 0 ? `Suíte ${alarm.suite}` : 'Atenção!',
      message: message,
      onOk: () => {
        showingDialog = false;
        notifyAlarmReceived(alarm);
      }
    });    
  }

  const isAlarmForMe = (alarm) => {
    return (alarm.funcionario == login.funcionario_id) || (alarm.funcionario == 0);
  }

  const onTimer = () => {

    if (showingDialog) {
      toggle();
      return;
    }

    api.get(`/api/alarms/${login.uuid}`).then(response => {
      const alarms = response.data;
      for (var i = alarms.length; i--;) {
        var alarm = alarms[i];
        if (isAlarmForMe(alarm)) {
          showAlarmDialog(alarm);
          return;
        }
      }
    });    

  }
  
  return '';

}


  