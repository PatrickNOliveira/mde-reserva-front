import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

export default function alerta({title, message, onYes, onNo}) {

    if (!onYes && !onNo) {

      confirmAlert({
        title: title,
        message: message,
        buttons: [
          {
            label: 'OK',
            onClick: () => {}
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
            label: 'ok',
            onClick: () => {
                 if (onYes) onYes();
            }
          },//{
            //label: 'Não',
            //onClick: () =>{
               // if (onNo) onNo();
            //}
          //}
        ]
    });

}
