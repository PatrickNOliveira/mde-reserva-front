import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

export default function alerta({title, message, onYes, onNo, onOk}) {

    if (!onYes && !onNo) {

      confirmAlert({
        title: title,
        message: message,
        buttons: [
          {
            label: 'OK',
            onClick: () => {
              if (typeof onOk === "function") onOk();
            }
          }
        ]
      });
  
      return;

    }

    confirmAlert({
        title: title,
        message: message,
        buttons: [
          {
            label: 'SIM',
            onClick: () => {
                 if (typeof onYes === "function") onYes();
            }
          },{
            label: 'NÃO',
            onClick: () =>{
                if (typeof onNo === "function") onNo();
            }
          }
        ]
    });

}
