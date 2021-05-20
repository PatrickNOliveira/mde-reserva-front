import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//Provider é obrigatório importar, para o redux;
import { Provider } from 'react-redux'
//Esse é o import do store, ou seja do corpo dos reducers.
import store from './store/store'
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Provider store={ store }>
    <React.StrictMode>
        <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
reportWebVitals();
