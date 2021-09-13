// https://blog.heroku.com/deploying-react-with-zero-configuration
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { shade } from 'polished';
import { useHistory, useParams } from "react-router-dom";
import api from '../services/api';
import { 
  setLogin, 
  getConta, 
  getHost, 
  setMesaAtual, 
  setCardapioAtual,
  setSuiteAtual,
  getColab,
  contaEncerrada } from '../utils/utils-context';

const EntrarWINLETOM = () => {

  const host = getHost();
  const { id } = useParams();
  const history = useHistory();
  const [suite, setSuite] = useState('');
  const [cpf, setCPF] = useState('');
  const [conta] = useState(getConta());

  return(
    <Container>
        <Content>
        <img src={`${host}/api/logo/${conta.codigo}`}  alt="logo" />
        <form>
            <h1>Entrar</h1>
            <input 
              value={suite} 
              onChange={(event) => {setSuite(event.target.value)}}            
              placeholder="Suíte nº"/>
            <input 
              value={cpf} 
              onChange={(event) => {setCPF(event.target.value)}}            
              placeholder="Documento (somente dígitos)"/>

            <button onClick={(event) => {
                event.preventDefault();
                api.post('/api/entrar', { 
                  id: id,
                  suite: suite, 
                  cpf: cpf,
                }).then(response => {

                  console.log('Login:', response.data);

                  if (contaEncerrada(response.data)){
                    history.push({ pathname: `/${id}` });
                    return;
                  }
                    
                  setLogin(response.data);
                  setSuiteAtual(response.data.suite);
                  history.push({ pathname: `/menu/${id}` });

                }).catch((error) => {
                    if (error.response) console.log(error.response.status);
                });
            }}>Entrar</button>

        </form>
        </Content>
    </Container>
  )

}

const EntrarWINRESTA = () => {

  const host = getHost();
  const { id } = useParams();
  const history = useHistory();
  const [usuario, setUsuario] = useState('padrao');
  const [senha, setSenha] = useState('');
  const [conta] = useState(getConta());

  /*
    <input 
    value={usuario} 
    onChange={(event) => {setUsuario(event.target.value)}}            
    placeholder="Usuário" />
  */

    return(
    <Container>
        <Content>
        <img src={`${host}/api/logo/${conta.codigo}`}  alt="logo" />
        <form>
            <h1>Entrar</h1>
            <input 
              type='password'
              value={senha} 
              onChange={(event) => {setSenha(event.target.value)}}            
              placeholder="Senha"/>
            <button onClick={(event) => {
                event.preventDefault();
                api.post('/api/entrar', { 
                  id: id,
                  login: usuario, 
                  senha: senha,
                }).then(response => {
                  console.log('Login:', response.data);
                  setLogin(response.data);
                  setMesaAtual(null);
                  history.push({ pathname: `/menu/${id}` });
                }).catch((error) => {
                    if (error.response) console.log(error.response.status);
                });
            }}>Entrar
            </button>
        </form>
        </Content>
    </Container>
  )
}

const EntrarWINLETOH = () => {
  const host = getHost();
  const [conta] = useState(getConta());

  return (
    <Container>
        <Content>
          <img src={`${host}/api/logo/${conta.codigo}`}  alt="logo" />
        </Content>
    </Container>
  )
}

export default function Entrar() {

  const { id } = useParams();
  
  const history = useHistory();
  const [login] = useState(null); //getLogin());
  const [colab] = useState(getColab());
  const [conta] = useState(getConta());
  
  console.log('Conta:', conta);

  useEffect(() => {
    setCardapioAtual(null);
    setSuiteAtual(null);
    //if (login == null) history.push({ pathname: `/entrar/${id}` });
    //else history.push({ pathname: `/menu/${id}` });
  },[]);

  return (
    (conta.sistema == 'WINRESTA' || colab) ? ( <EntrarWINRESTA /> ) : (<EntrarWINLETOM />)
  )

}

//    conta.sistema === 'WINLETOM' ? ( <EntrarWINLETOM /> ) : (
//  conta.sistema === 'WINRESTA' ? ( <EntrarWINRESTA /> ) : ( <EntrarWINLETOM /> )
//  )


const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  place-content: center;

  width: 100%;
  max-width: 700px;

  img {
    border-radius:7px;
  }

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    input {
      background: #232129;
      border-radius: 10px;
      padding: 16px;
      width: 100%;

      color: #666360;
      border: 2px solid #232129;

      display: flex;
      align-items: center;
      margin-top: 8px;
      
    }

    button {
      background: #ff9000;
      height: 56px;
      border-radius: 10px;
      border: 0;
      padding: 0 16px;
      color: #312e38;
      width: 100%;
      font-weight: 500;
      margin-top:16px;
      transition: background-color 0.2s;
      font-weight: bold;

      &:hover {
        background:${shade(0.2, '#ff9000')};
      }
    }
  }

  > a {
    color: #ff9000;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    &:hover {
      color: ${shade(0.2, '#ff9000')}
    }
  }
`;

/*
const Background = styled.div`
  flex: 1;
  background: url(${hotelImg}) no-repeat center;
  background-size: cover;
`;
*/
