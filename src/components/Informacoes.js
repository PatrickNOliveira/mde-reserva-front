import React, { useEffect, useState } from 'react';
import { BsArrowLeftShort } from "react-icons/bs";
import { Link, useParams, useHistory } from "react-router-dom";
import styled from 'styled-components';
import { getLogin } from '../utils/utils-context';

export default function Informacoes() {
    
    const { id }  = useParams();
    const history = useHistory();
    const [login] = useState(getLogin());

    useEffect(() => {
        if (login == null) history.push({ pathname: `/entrar/${id}` });
    },[]);

    const onMenuClick = () => {
        history.push({ pathname: `/menu/${id}` });
    }

    return(
        <div className="root">
            
            <div className="header">
                <div  className="header-content">
                    <a href="#" onClick={onMenuClick} className="requests">
                        <BsArrowLeftShort className="seta" type="button" /> 
                    </a>
                </div>
                <h1>Informações</h1>
            </div> 

            <InfoUsers className="user">
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
                <p>Versão</p>
                <strong>1.0.5</strong>   
            </InfoUsers>
        </div>
    )
}

const InfoUsers = styled.div`
    margin:50px;
    width: 75%;

    p {
        margin-top: 30px;
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