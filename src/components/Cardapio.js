import React, { useEffect, useState } from 'react';
import { BsHouseDoor, BsChevronDown } from "react-icons/bs";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import styled from 'styled-components';

import api from '../services/api';

import ListaItensCardapio from './ListaItensCardapio';
import ListaItensCarrinho from './ListaItensCarrinho';
import MostraCardapios from './MostraCardapios';

//import '../styles/product.css';

import { 
    setLogin,
    getLogin,
    getGrupoAtual, 
    getCardapioAtual, 
    setCardapioAtual,
    contaEncerrada, 
    setGrupoAtual} from '../utils/utils-context';

export default function Cardapio() {

    const { id } = useParams();

    const history = useHistory();
    
    const [login] = useState(getLogin());
    
    const { busca } = useLocation();

    const [ cardapio, setCardapio ] = useState(getCardapioAtual());
    
    const [ buscaCardapio, setBuscaCardapio ] = useState(cardapio.id === 0);

    const [ buscaGrupo, setBuscaGrupo ] = useState(busca);
    
    //const [items, setItems]       = useState();
    const [produtos, setProdutos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [grupo, setGrupo] = useState(getGrupoAtual());

    const [ mostraCarrinho, setMostraCarrinho ] = useState(false);

    const [ cssProduto, setCSSProduto ] = useState(mostraCarrinho ? 'btnProdutos': 'btnProdutosClicked');
    const [ cssCarrinho, setCSSCarrinho ] = useState(mostraCarrinho ? 'btnCarrinhoClicked' : 'btnCarrinho');

    useEffect(() => {

        //setBuscaGrupo(true);

        if (login == null) history.push({ pathname: `/${id}` });
        
        if (cardapio.id === 0) return;
        
        if (contaEncerrada(login)) {
            setLogin(null);
            history.push({ pathname: `/${id}` });
            return;
        }
    
        let mounted = true;
        
        api.get(`/api/order/products/${login.uuid}/${cardapio.id}`).then(response => {

            const getGrupos = (items) => {
                const grupos = [];
                for (var i in items) {
                    if (grupos.includes(items[i].tipo)) continue;
                    grupos.push(items[i].tipo);
                }
                return grupos;
            }

            if (!mounted) return;

            setProdutos(response.data);
            
            const _grupos = getGrupos(response.data);

            setGrupos(_grupos);
            setGrupo(getGrupoAtual());
            
        });

        return function cleanup() {
            mounted = false;
        }

    }, [cardapio]);
    
    //[items, cardapio]);

    const setProdutoClicked = () => {
        setCSSProduto('btnProdutosClicked');
        setCSSCarrinho('btnCarrinho');
    }

    const setCarrinhoClicked = () => {
        setCSSCarrinho('btnCarrinhoClicked');
        setCSSProduto('btnProdutos');
    }

    const onProdutosClick = () => {
        //setItems(produtos);
        setMostraCarrinho(false);
        setProdutoClicked();
    }

    /*
    const onServicosClick = () => {
        setItems(servicos);
        setMostraCarrinho(false);
    }
    */

    const onCarrinhoClick = () => {
        setMostraCarrinho(true);
        setCarrinhoClicked();
    }
  
    const onItemClick = (item) =>{
        history.push({ pathname: `/adiciona/${id}`, item: item });        
    }

    const onMenuClick = () => {
        history.push({ pathname: `/menu/${id}` });
    }

    const onCardapioClick = (cardapio) => {
        setBuscaCardapio(false);
        setCardapioAtual(cardapio);
        setCardapio(cardapio);
        setBuscaGrupo(true);
    }

    const onBuscaCarpadioClick = () => {
        setBuscaCardapio(true);
    }

    /*
        <Link to='#' style={{color:'white', padding: '10px', textDecoration: 'none'}} onClick={onServicosClick}>Serviços</Link>
    */

    const onGrupoClick = () => {
        setBuscaGrupo(true);
    }

    const onGrupoSelecionadoClick = (g) => {
        setGrupo(g);
        setGrupoAtual(g);
        setBuscaGrupo(false);
    }

    const onFinalizaPedido = () => {
        setBuscaCardapio(true);
    }

    const MostraGrupos = () => {
        return (
            <Grupo>
                {
                    grupos.map((g, i) => 
                        <div>
                            <a className="botao-seleciona-grupo" 
                                key={i}
                                href="#" 
                                onClick={ () => onGrupoSelecionadoClick(g) } 
                                style={{color:'white'}}>{g}
                            </a> 
                        </div>                        
                    )
                }
            </Grupo>
        )
    }

    const BtnGrupo = () => {
        return (
            <a className="botao-grupo" href="#" onClick={onGrupoClick}>
                <span>{grupo}</span>
                <BsChevronDown style={{ float: 'right', display: 'flex' }} />                  
            </a>   
        )
    }

    const MostraCardapio = () => {

        const [pesquisa, setPesquisa] = useState('');

        return (

            <div className="body">
                {
                    grupo ? <BtnGrupo />
                    : ''
                }

                <div className="filtros">
                    {
                        login.login ? ( // Garçom
                            <div className="pnlOptions">
                                <Link to='#' className={cssProduto} onClick={onProdutosClick}>Produtos</Link>
                                <Link to='#' className={cssCarrinho} onClick={onCarrinhoClick}>Carrinho</Link>
                            </div>

                        ) : ( // Hospede
                            <div className="pnlOptions">
                                <Link to='#' className={cssProduto} onClick={onProdutosClick}>Produtos</Link>
                                <Link to='#' className={cssCarrinho} onClick={onCarrinhoClick}>Carrinho</Link>
                            </div>
                        )
                    }
                </div>

                <div className="lista">
                { 
                    mostraCarrinho ? (

                        <ListaItensCarrinho 
                            suite_id={login.suite_id} 
                            onCarrinhoVazio={onProdutosClick}
                            onFinalizaPedido={onFinalizaPedido}
                        />
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

                            <ListaItensCardapio 
                                pesquisa={pesquisa} 
                                items={produtos} 
                                onItemClick={onItemClick} 
                                grupo={grupo}
                            />
                            
                        </div>
                    )
                }
                </div>
            </div>  
        )
    }

    const MenuCardapio = () => {
        return (
            <div className="btnCardapio" onClick={onBuscaCarpadioClick}>
                <span className="nome_cardapio">Cardápio</span>
                <span className="tipo_cardapio">{cardapio.descricao}</span>
            </div>
        )
    }

// <BsHouseDoor onClick={onMenuClick} className="seta" type="button"  /> 
// <BsMap onClick={onBuscaCarpadioClick} className="cardapio" type="button"  /> 
    return (

        <div className="root">

            <div className="header">

                <div className="header-content">
                    <BsHouseDoor className="seta" onClick={onMenuClick} type="button"  />                    
                    <MenuCardapio />
                    <BsHouseDoor className="hidden"  />                    
                 </div>

            </div>

            {
                buscaCardapio ? <MostraCardapios id={id} onCardapioClick={onCardapioClick} />
                : buscaGrupo ? <MostraGrupos /> : <MostraCardapio />
            }

        </div>
    )

}


const Grupo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 80vh;
  margin-top: 60px;
  `;

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