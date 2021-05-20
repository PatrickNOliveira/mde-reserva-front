import React, { useEffect, useState } from 'react';
import api from '../services/api';
import styled from 'styled-components';
import { shade } from 'polished';
import { getLogin } from '../utils/utils-context';

export default function MostraCardapios({id, onCardapioClick}) {

    const [ cardapios, setCardapios ] = useState([]);
    const [ login ] = useState(getLogin());

    useEffect(() => {
    
        let mounted = true;
        
        api.get(`/api/cardapios/${id}`).then(response => {
            if (!mounted) return;
            console.log('Cardapios:', response.data);
            setCardapios(
                response.data.filter((c) => {
                    //if (!login.login) return true; 
                    if (login.cardapios === 0) return true; // funcionários e hóspedes
                    return login.cardapios.indexOf(c.id) !== -1;
                })
            );
        });

        return function cleanup() {
            mounted = false;
        }

    }, []);
    
    /*
                cardapios.map(cardapio =>
                    <CardContainer id={cardapio.id}>
                        <a href="#" 
                            onClick={() => onCardapioClick(cardapio)} 
                            className="requests">{cardapio.descricao}
                        </a>
                    </CardContainer>
                )
    */

    return (
        <Container>
            {
                cardapios.map(cardapio =>
                    <CardContainer key={cardapio.id} id={cardapio.id}>
                        <a href="#" 
                            onClick={() => onCardapioClick(cardapio)} 
                            className="requests">{cardapio.descricao}
                        </a>
                    </CardContainer>
                )
            }
        </Container>
    )
    
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 80vh;
  width: 350px;
`;

const CardContainer = styled.div`
    background: #232129;
    border-radius: 5px;
    width: 80%;
    padding: 18px;
    display: flex;
    align-items: center;
    justify-content: center; 
    margin-top: 16px;

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
