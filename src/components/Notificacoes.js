import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams, useLocation } from 'react-router-dom';
import { BsArrowLeftShort } from "react-icons/bs";
import api from '../services/api';
import styled from 'styled-components';

import { 
    getLogin,
} from '../utils/utils-context';

import ListaNotificacoes from './ListaNotificacoes';

export default function Notificacoes() {

    const { id }  = useParams();
    const [login] = useState(getLogin());
    
    const [pesquisa, setPesquisa] = useState('');
    
    const [notificacoes, setNotificacoes] = useState([]);

    const { origin } = useLocation();

    const history = useHistory();

    useEffect(() => {

        var TIMER;

        if (login == null) history.push({ pathname: `/${id}` });

        //onTimer();

        let mounted = true;

        TIMER = setInterval(function(){
            if (!mounted) return;
            onTimer();
        }, 10000);

        return function cleanup() {
            
            mounted = false;

            setTimeout(() => {
                clearInterval(TIMER);
                TIMER = null;
            }, 1000);

        }

    },[]);

    const onTimer = () => {
        api.get(`/api/notify/${login.uuid}`).then(response => {
            setNotificacoes(response.data);
        });
    }

    const onVoltarClick = () => {
        switch (origin) {
            case 'servico':
                history.push({ pathname: `/servicos/${id}` });
                break;
            default:
                history.push({ pathname: `/menu/${id}` });     
                break;
        }
    }

    return (
        <div className="rooms">
            <div className="header">
                <div  className="header-content">
                    <Link to="#" onClick={onVoltarClick}>
                        <BsArrowLeftShort type="button" className="seta" />
                    </Link>               
                </div>
                <h1 style={{ fontSize: 22  }}>Notificações</h1>
            </div>
            <div>
                <div style={{ padding: '0px 10px' }} >
                    <SearchBox>
                        <form>
                            <input value={pesquisa} onChange={(event) => {setPesquisa(event.target.value)}}
                            placeholder="Digite aqui sua pesquisa" />
                        </form>                                    
                    </SearchBox>
                </div>
                <ListaNotificacoes pesquisa={pesquisa} items={notificacoes} />

            </div>
        </div>
);
    
}

const SearchBox = styled.div`
    input {
        margin-top: 50px;
        background: #232129;
        border-radius: 10px;
        padding: 16px;
        width: 100%;

        color: #666360;
        border: 2px solid #232129;

        display: flex;
        align-items: center;
       
    }
`;
