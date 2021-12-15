import React, { useEffect, useState } from 'react';
import { BsArrowLeftShort } from "react-icons/bs";
import { Link, useParams, useHistory } from "react-router-dom";
import styled from 'styled-components';
import { getLogin } from '../utils/utils-context';
import { shade } from 'polished';
import getPreco from '../utils/getPreco';
import api from '../services/api';

export default function Informacoes() {

    const build   = '1.0.34';
    
    const { id }  = useParams();
    const history = useHistory();
    const [login, setLogin] = useState(getLogin());
    const [opcao, setOpcao] = useState('MENU');
    const [titulo, setTitulo ] = useState('Informações');
    const [timer, setTimer] = useState(true);

    var TIMER;

    useEffect(() => {
        if (login == null) history.push({ pathname: `/entrar/${id}` });
        
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
        const data = { id: login.uuid, suite: login.suite, cpf: login.cpf };
        console.log('data:', data);
        api.post('/api/entrar', data).then(response => {
            console.log('/api/entrar:', response.data);
            setTimer(!timer);
        }).catch((error) => {
            if (error.response) console.log(error.response.status);
        });
    }

    const MenuPrincipal = () => {
        return (
            <Container>

              <CardContainer>
                    <a href="#" onClick={onPerfilClick} className="requests">Perfil</a>
              </CardContainer>

              {
                  !login.login ? (
                    <CardContainer>
                        <a href="#" onClick={onContaClick} className="requests">Conta</a>
                    </CardContainer>
                  ) : ""
              }
      
            </Container>
        );
    }

    const onPerfilClick = () => {
        setOpcao('PERFIL'); setTitulo('Perfil de uso')
    }

    const onContaClick = () => {
        setOpcao('CONTA'); setTitulo('Resumo da conta')
    }

    const onVoltarClick = () => {
        if (opcao == "MENU") {
            history.push({ pathname: `/menu/${id}` });
            return;
        }
        setOpcao("MENU"); setTitulo("Informações");
    }

    const InfoPerfil = () => {
        if (login.login) return <InfoFuncionario />
        else return <InfoHospede />
    }

    const InfoConta = () => {
        return (
            <InfoUsers>
            <p>Diárias (+)</p>
            <strong>{getPreco(login.diarias)}</strong>
            <p>Extras (+)</p>
            <strong>{getPreco(login.extras)}</strong>   
            <p>Taxas (+)</p>
            <strong>{getPreco(login.taxas)}</strong>   
            <p style={{color: '#d0fa5b'}}>Antecipado (-)</p>
            <strong>{getPreco(login.antecipado)}</strong>   
            <p style={{color: '#ff9000'}}>Saldo (=)</p>
            <strong>{getPreco(login.saldo)}</strong>   
        </InfoUsers>
        )
}

    const InfoFuncionario = () => {
        return (
            <InfoUsers>
                <p>Funcionário</p>
                <strong>{funcionario}</strong>
                <p>Build</p>
                <strong>{build}</strong>   
            </InfoUsers>
        )
    }

    const InfoHospede = () => {
        return (
            <InfoUsers>
                <p>Reserva</p>
                <strong>{login.reserva}</strong>
                <p>Hóspede Master</p>
                <strong>{login.hospede}</strong>
                <p>Suíte</p>
                <strong>{login.suite}</strong>
                <p>Check-in</p>
                <strong>{login.checkin}</strong>
                <p>Check-out</p>
                <strong>{login.checkout}</strong>   
                <p>Build</p>
                <strong>{build}</strong>   
            </InfoUsers>
        )
    }

    const funcionario = login.login + ' ' + login.funcionario_id;

    return(
        
        <div className="rooms">

            <div className="header">
                <div  className="header-content">
                    <a href="#" onClick={onVoltarClick} className="requests">
                        <BsArrowLeftShort className="seta" type="button" /> 
                    </a>
                </div>
                <div>
                    <span className="nome_cardapio">{titulo}</span>
                </div>                
            </div> 

            {
                opcao === "MENU" ? <MenuPrincipal /> :
                (opcao == "PERFIL" ? 
                    <InfoPerfil /> : 
                    <InfoConta  timer={timer} /> )
            }
            

        </div>
    )
}

//{
//    login.login ? <InfoFuncionario /> : <InfoHospede />
//}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 120px;
  align-items: center;
  justify-content: start;
  height: 80vh;
`;

const CardContainer = styled.div`
    background: #232129;
    border-radius: 5px;
    width: 80%;
    padding: 18px 98px;
    display: flex;
    align-items: center;
    justify-content: center; 
    margin-top: 46px;
    margin-bottom: 40px;

    :hover {
        background: ${shade(0.2, '#232129')}
      } 

    a{
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: #fff; 
      font-size: 26px;
    }
`;

const InfoUsers = styled.div`
    margin:50px;
    width: 75%;

    p {
        margin-top: 10px;
        margin-bottom: 5px;
    }
    
    strong {
        display: flex;
        padding: 8px 0 8px 10px;

        background: #666;
        border-radius: 5px;
        font-size: 24px;
    }
`;