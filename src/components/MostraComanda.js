import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
import getPreco from '../utils/getPreco'

export default function MostraComanda({mesa, comanda, onPesquisarMesa, onTrocarItemMesa}) {
    
    const { id } = useParams();
    const history = useHistory();
    
    const onMenuClick = () => {
        history.push({ pathname: `/menu/${id}` });
    }

    return (
        <div className="root">
            <div className="header">
                <div  className="header-content">
                    <BsArrowLeftShort onClick={onMenuClick} className="seta" type="button"  /> 
                </div>
                <h1>Pedidos</h1>
            </div>    
            <div className="body">

                <div className="lista_pedidos">
                    
                    <PesquisaMesa>
                        <form>
                            <input 
                                value={mesa}
                                onChange={(event) => {
                                    onPesquisarMesa(event.target.value);
                                }}
                                placeholder="Mesa"/>
                        </form>
                    </PesquisaMesa>

                    <ListaItensComanda items={comanda.items} onTrocarItemMesa={onTrocarItemMesa} />
                    
                    <Total total={comanda.total} />

                </div>

            </div>        
        </div>
    )
}

const Total = ({total}) => {
    if (!total || total === 0) 
        return ''//<div className='total'>Não há pedidos!</div>
    return (
        <div className='total'>Total: {getPreco(total)}</div>
    )
};

const TrocarMesa = ({item, trocar, onTrocarItemMesa}) => {

    const [novaMesa, setNovaMesa] = useState('');

    if (trocar) return (
        <div>
            <TrocaMesa>
                <form>
                    <input value={novaMesa} placeholder = "Mesa" 
                        onChange={(event) => {
                            setNovaMesa(event.target.value);
                        }}                    
                    />
                </form>
            </TrocaMesa>

            <a  className="trocar-mesa" 
                href="#" 
                onClick={() => { onTrocarItemMesa(item, novaMesa) } } 
                style={{color:'white'}}>Trocar
            </a>

        </div>
)
    return '';
}

const ListaItensComanda = ({items, onTrocarItemMesa}) => {

    const [trocarMesa, setTrocarMesa] = useState(false);
    
    if (!items || items.length === 0) return (
        <SemItensStyle>Sem ítens!</SemItensStyle>
    )

    const onItemClick = (item) => {
        if (item.atendido) return;
        setTrocarMesa(!trocarMesa);
    }

    return (

        items.map(item =>
            <div>
                <div className='item' onClick={() => onItemClick(item)} >
                    <p style={{fontSize:14, color:'#a2a276'}}>Nº {item.codigo}</p>
                    <p style={{color:'#3fe799', fontSize:16}}>{item.descricao}</p>
                    <p style={{fontSize:14, width: 200}}>{item.nota}</p>
                    <p style={{fontSize:18}}>
                        <span style={{color:'#8c8c8c'}}>{item.quantidade} x {getPreco(item.preco)}</span> = {getPreco(item.preco, item.quantidade)}
                    </p>
                    {
                        item.atendido ? ('') : (
                            <p className="toque" style={{fontSize:14}}>Toque para trocar mesa</p>
                        )
                    }
                </div>
                <TrocarMesa 
                    item={item} 
                    trocar={trocarMesa} 
                    onTrocarItemMesa={(item, mesa) => {
                        setTrocarMesa(false);
                        onTrocarItemMesa(item, mesa)
                    }} />
            </div>

        )
    )
}

/*
    <div className="products-image">
        <img className="product-img" src={`https://api-sistema-mde.herokuapp.com/api/order/photo/${item.foto}`} alt=""/>
    </div>
*/

const PesquisaMesa = styled.div`
    input {
        background: #232129;
        border-radius: 10px;
        margin-top: 60px;
        padding: 16px;
        width: 100%;
        color: #666360;
        border: 2px solid #232129;
        display: flex;
        align-items: center;
    }
`;

const TrocaMesa = styled.div`
    input {
        background: #232129;
        border-radius: 10px;
        margin-top: 10px;
        padding: 16px;
        width: 100%;
        color: #666360;
        border: 2px solid #232129;
        display: flex;
        align-items: center;
    }
`;

const SemItensStyle = styled.p`
    display: flex;
    justify-content:center;
    margin-top: 10px;
    align-items:center;
    font-size: 25px;
`;
