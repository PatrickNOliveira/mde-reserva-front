import React, { useEffect, useState } from 'react';
import { useHistory, useParams, useLocation } from "react-router-dom";
import styled from 'styled-components';
import { shade } from 'polished';
import { getLogin, getConta, getHost } from '../utils/utils-context';

const MenuWINLETOM = () => {

  const { id }  = useParams();
  const history = useHistory();
  
  const [conta] = useState(getConta());
  const [login] = useState(getLogin());

  console.log(login);

  const host = getHost();

  const onCardapioClick = () => {
    history.push({ pathname: `/cardapio/${id}` });
  }

  const onPedidosClick = () => {
    history.push({ pathname: `/pedidos/${id}` });
  }

  const onInformacoesClick = () => {
    history.push({ pathname: `/informacoes/${id}` });
  }

  const onSairClick = () => {
    localStorage.setItem('login', null);
    history.push({ pathname: `/${id}` });
    //history.push({ pathname: `/home/${id}` });
  }
  
  // https://api-sistema-mde.herokuapp.com

  return (
      <Container>

        <ImgContainer>
          <img src={`${host}/api/logo/${conta.codigo}`}  alt="logo" />
        </ImgContainer>

        {
          (login.login) ? '' : (
            <CardContainer>
              <a href="#" onClick={onInformacoesClick} className="requests">Informações</a>
            </CardContainer>
          )
        }

        <CardContainer>
          <a href="#" onClick={onCardapioClick} className="requests">Cardápio</a>
        </CardContainer>

        <CardContainer>
          <a href="#" onClick={onSairClick}>Sair</a>
        </CardContainer>

      </Container>
  );

}

/*
        {
          (login.login) ? '' : (
            <CardContainer>
              <a href="#" onClick={onPedidosClick} className="consumme">Pedidos</a>
            </CardContainer>
          )
        }
*/

const MenuWINRESTA = () => {

  const { id }  = useParams();
  const history = useHistory();
  const [conta] = useState(getConta());
  
  const host = getHost();

  const onCardapioClick = () => {
    history.push({ pathname: `/cardapio/${id}` });
  }

  const onPedidosClick = () => {
    history.push({ pathname: `/pedidos/${id}` });
  }

  const onSairClick = () => {
    localStorage.setItem('login', null);
    history.push({ pathname: `/home/${id}` });
  }

  return (

    <Container>

      <ImgContainer>
        <img src={`${host}/api/logo/${conta.codigo}`}  alt="logo" />
      </ImgContainer>

      <CardContainer>
        <a href="#" onClick={onCardapioClick} className="requests">Cardápio</a>
      </CardContainer>

      <CardContainer>
        <a href="#" onClick={onSairClick}>Sair</a>
      </CardContainer>

    </Container>
);

/*
      <CardContainer>
          <a href="#" onClick={onPedidosClick} className="consumme">Pedidos</a>
      </CardContainer>
*/

}

const MenuWINLETOH = () => {
  const { id }  = useParams();
  const history = useHistory();
  
  const [conta] = useState(getConta());
  const [login] = useState(getLogin());

  console.log(login);

  const host = getHost();

  const onCardapioClick = () => {
    history.push({ pathname: `/cardapio/${id}` });
  }

  const onPedidosClick = () => {
    history.push({ pathname: `/pedidos/${id}` });
  }

  const onInformacoesClick = () => {
    history.push({ pathname: `/informacoes/${id}` });
  }

  const onSairClick = () => {
    localStorage.setItem('login', null);
    history.push({ pathname: `/home/${id}` });
  }
  
  // https://api-sistema-mde.herokuapp.com

  return (
      <Container>

        <ImgContainer>
          <img src={`${host}/api/logo/${conta.codigo}`}  alt="logo" />
        </ImgContainer>

        {
          (login.login) ? '' : (
            <CardContainer>
              <a href="#" onClick={onInformacoesClick} className="requests">Informações</a>
            </CardContainer>
          )
        }

        {
          (login.cardapios === -1) ? '' : (
            <CardContainer>
              <a href="#" onClick={onCardapioClick} className="requests">Cardápio</a>
            </CardContainer>
          )
        }

        <CardContainer>
          <a href="#" onClick={onSairClick}>Sair</a>
        </CardContainer>

      </Container>
  );

  /*
        {
          (login.login) ? '' : (
            <CardContainer>
              <a href="#" onClick={onPedidosClick} className="consumme">Pedidos</a>
            </CardContainer>
          )
        }
 */

}

export default function Menu() {

  const { id }  = useParams();
  const history = useHistory();
  const [login] = useState(getLogin());
  const [conta] = useState(getConta());

  console.log()
  useEffect(() => {
    if (login == null) history.push({ pathname: `/entrar/${id}` });
  },[]);

  return (
    conta.sistema === 'WINLETOM' ? ( <MenuWINLETOM /> ) : (
      conta.sistema === 'WINRESTA' ? ( <MenuWINRESTA /> ) : ( <MenuWINLETOH /> )
    )
  );
  
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 80vh;
`;

const ImgContainer = styled.div`
  background: #232129;
  margin-top: 90px;
  border-radius: 8px;

  img {
    border-radius: 8px;
  }
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
