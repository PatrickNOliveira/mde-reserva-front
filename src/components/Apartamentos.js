import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory, useParams } from 'react-router-dom';
import { BsArrowLeftShort } from "react-icons/bs";
import api from '../services/api';
import styled from 'styled-components';

import { 
    getLogin,
    getConta,
    setApartamentoAtual,
} from '../utils/utils-context';

export default function Apartamentos() {

    const { id }  = useParams();
    const [login] = useState(getLogin());
    const history = useHistory();
    const [ apartamentos, setApartamentos] = useState([]);

    useEffect(() => {
        if (login == null) history.push({ pathname: `/${id}` });
        api.get(`/api/rooms/${login.uuid}`).then(response => {
            setApartamentos(response.data);
        });

    },[]);

    const onVoltarClick = () => {
        history.push({ pathname: `/cardapio/${id}` });     
    }

    const onApartamentoClick = (ap) => {
        setApartamentoAtual(ap);
    }

    return (
        <div className="rooms">
            <div className="header">
                <div  className="header-content">
                    <Link to="#" onClick={onVoltarClick}>
                        <BsArrowLeftShort type="button" className="seta" />
                    </Link>               
                </div>
                <h1 style={{ fontSize: 22  }}>Ocupações</h1>
            </div>
            <Apartamento>
                {
                    apartamentos.map((ap, i) => 
                            <a className="botao-apartamento" 
                                key={i}
                                href="#" 
                                onClick={ () => onApartamentoClick(ap) } 
                                style={{color:'white'}}>{ap.id}
                            </a> 
                    )
                }
            </Apartamento>
        </div>
    );
    
}

const Apartamento = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-top: 40px;
  `;

