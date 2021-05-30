import React, { useEffect, useState } from 'react';
import { BsArrowLeftShort, BsMap } from "react-icons/bs";
import { Link, useHistory, useParams } from "react-router-dom";
import styled from 'styled-components';

import api from '../services/api';

import ListaItensCardapio from './ListaItensCardapio';
import ListaItensCarrinho from './ListaItensCarrinho';
import MostraCardapios from './MostraCardapios';

//import '../styles/product.css';

import { getLogin, getCardapioAtual, setCardapioAtual } from '../utils/utils-context';

export default function Cardapio() {

    const { id } = useParams();

    const history = useHistory();
    
    const [login] = useState(getLogin());

    const [ cardapio, setCardapio ] = useState(getCardapioAtual());
    
    const [ buscaCardapio, setBuscaCardapio ] = useState(cardapio.id === 0);

    //const [items, setItems]       = useState();
    const [produtos, setProdutos] = useState([]);
    const [servicos, setServicos] = useState([]);
    
    const [ mostraCarrinho, setMostraCarrinho ] = useState(false);
    
    useEffect(() => {
        
        if (login == null) history.push({ pathname: `/entrar/${id}` });
        
        if (cardapio.id === 0) return;

        let mounted = true;
        
        api.get(`/api/order/products/${login.uuid}/${cardapio.id}`).then(response => {

            if (!mounted) return;

            console.log('produtos:', response.data);

            setProdutos(response.data);

            /*

            setProdutos(response.data.filter((p) => {
                return p.tipo !== 'servico';
            }));

            setServicos(response.data.filter((p) => {
                return p.tipo === 'servico';
            }));
            */

        });

        return function cleanup() {
            mounted = false;
        }

    }, [cardapio]);
    
    //[items, cardapio]);
    
    const onProdutosClick = () => {
        //setItems(produtos);
        setMostraCarrinho(false);
    }

    /*
    const onServicosClick = () => {
        setItems(servicos);
        setMostraCarrinho(false);
    }
    */

    const onCarrinhoClick = () => {
        setMostraCarrinho(true);
    }
  
    const onItemClick = (item) =>{
        history.push({ pathname: `/adiciona/${id}`, item: item });        
    }

    const onMenuClick = () => {
        history.push({ pathname: `/menu/${id}` });
    }

    const onCardapioClick = (cardapio) => {
        
        console.log(cardapio);

        setBuscaCardapio(false);
        setCardapioAtual(cardapio);
        setCardapio(cardapio);
    }

    const onBuscaCarpadioClick = () => {
        setBuscaCardapio(true);
    }

    /*
        <Link to='#' style={{color:'white', padding: '10px', textDecoration: 'none'}} onClick={onServicosClick}>Serviços</Link>
    */

    const MostraCardapio = () => {

        const [pesquisa, setPesquisa] = useState('');

        return (
            <div className="body">
                <div className="filtros">
                    {
                        login.login ? ( // Garçom
                            <div>
                                <Link to='#' style={{color:'white', padding: '10px', paddingRight: '90px', textDecoration: 'none'}} onClick={onProdutosClick}>Produtos</Link>
                                <Link to='#' style={{color:'white', padding: '10px', textDecoration: 'none'}} onClick={onCarrinhoClick}>Carrinho</Link>
                            </div>

                        ) : ( // Hospede
                            <div>
                                <Link to='#' style={{color:'white', padding: '10px', paddingRight: '90px', textDecoration: 'none'}} onClick={onProdutosClick}>Produtos</Link>
                                <Link to='#' style={{color:'white', padding: '10px', textDecoration: 'none'}} onClick={onCarrinhoClick}>Carrinho</Link>
                            </div>
                        )
                    }
                </div>

                <div className="lista">
                { 
                    mostraCarrinho ? (

                        <ListaItensCarrinho 
                            suite_id={login.suite_id} 
                            onCarrinhoVazio={onProdutosClick}/>

                    ) : (

                        <div>

                            <SearchBox>
                                <form>
                                    <input 
                                        value={pesquisa}
                                        onChange={(event) => {
                                            setPesquisa(event.target.value)
                                        }}
                                        placeholder="Digite aqui sua pesquisa" />
                                </form>                                    
                            </SearchBox>

                            <ListaItensCardapio pesquisa={pesquisa} 
                                items={produtos} 
                                onItemClick={onItemClick} 
                            />
                            
                        </div>
                    )
                }
                </div>
            </div>  
        )
    }
    
/*
                            <ListaItensCardapio pesquisa={pesquisa} 
                                items={items ?? produtos ?? servicos} 
                                onItemClick={onItemClick} 
                            />

                            <SearchBox>
                                <form>
                                    <input 
                                        defaultValue={pesquisa}
                                        onChange={(event) => {
                                            setPesquisa(event.target.value)
                                        }}
                                        placeholder="Digite aqui sua pesquisa" />
                                </form>
                            </SearchBox>
*/

    return (
        <div className="root">
            <div className="header">
                <div  className="header-content">
                    <BsArrowLeftShort onClick={onMenuClick} className="seta" type="button"  /> 
                    <BsMap onClick={onBuscaCarpadioClick} className="cardapio" type="button"  /> 
                </div>
                <div>
                    <span className="nome_cardapio">Cardápio</span>
                    <span className="tipo_cardapio">{cardapio.descricao}</span>
                </div>
            </div>
            {
                buscaCardapio ? 
                    <MostraCardapios id={id} onCardapioClick={onCardapioClick} />
                    : <MostraCardapio />
                    
            }
        </div>
        
    );

}

const SearchBox = styled.div`
    input {
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