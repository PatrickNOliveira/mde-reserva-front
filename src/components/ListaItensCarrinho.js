import React, { useEffect, useState } from 'react';
//import '../styles/Requests.css';
import getPreco from '../utils/getPreco'
import alerta from '../utils/alertas';
import api from '../services/api';
import styled from 'styled-components';
import { useHistory } from "react-router-dom";

import { 
    getLogin, getMesaAtual, setLogin,
    setMesaAtual, getConta, contaEncerrada,
    getCardapioAtual, getSuiteAtual } from '../utils/utils-context';

import LocalEntrega from './LocalEntrega';

export default function ListaItensCarrinho({suite_id, onCarrinhoVazio}) {
    
    const history = useHistory();
    const [carrinho, setCarrinho] = useState({ items:[], total: 0});
    const [mensagem, setMensagem ] = useState('Aguarde...');
    const [login] = useState(getLogin());

    const [mesa] = useState(
        getLogin().suite_id ? null : getMesaAtual()
    );
    
    const [ suite ] = useState(getSuiteAtual());

    const [locais] = useState(getConta()['locais_entrega']);
    const [cardapio] = useState(getCardapioAtual());
    
    const [localizacao, setLocalizacao] = useState(
        getConta()['locais_entrega'] ? getConta()['locais_entrega'][0] : ''
    );

    const [observacao, setObservacao] = useState('');

    const isCheckout = () => {
        if (contaEncerrada(login)) {
            setLogin(null);
            history.push({ pathname: `/${login.uuid}` });
            return true;
        }
    }

    useEffect(() => {

        if (isCheckout()) return;

        let mounted = true;

        if (!suite_id && !mesa && !suite) {
            setMensagem('Sem ítens!');
            return;
        }
        
        let url = '';

        if (suite_id || suite)
            url = `/api/order/cart/${login.uuid}/${suite_id || suite}`;
        else 
            url = `/api/order/cart/waiter/${mesa}`;

        //let url = '/api/order/cart/' + (suite_id ? '' : ('waiter/' + login.uuid + '/')) + (suite_id ?? mesa);

        api.get(url).then(response => {

            if (!mounted) return;

            setCarrinho(response.data);

            setMensagem(
                response.data.items.length > 0 ? null : 'Sem ítens!'
            );

        });

        return function cleanup() {
            mounted = false;
        }

    },[mesa, suite_id]);

    const onItemClick = (item) => {
        
        if (isCheckout()) return;

        let url = '';
        
        if (suite_id || suite)
            url = `/api/order/cart/${login.uuid}/${suite_id || suite}/${item.id}`;
        else 
            url = `/api/order/cart/waiter/${mesa}/${item.id}`;

        //let url = '/api/order/cart/' + (suite_id ? '' : ('waiter/' + login.uuid + '/')) + (suite_id ?? mesa);

        alerta({ 
            title: 'Atenção!',
            message: 'Excluir esse ítem?',
            onYes: () => { 
                api.delete(url).then(response => {
                    if (response.data.total === 0)
                        setMesaAtual(null);    
                    setCarrinho(response.data);
                });                                
             }
        })

    }

    const onEnviarPedidoClick = () => {
        
        if (isCheckout()) return;

        alerta({ 
            title: 'Atenção!',
            message: 'Enviar esse pedido?',
            onYes: () => { 
                api.post('/api/order/cart', {
                    suite_id: suite ?? suite_id,
                    mesa: mesa,
                    localizacao: localizacao,
                    observacao: observacao,
                    uuid: login.uuid
                }).then(
                    response => {
                        setCarrinho(response.data);
                        setMesaAtual(null);
                        onCarrinhoVazio();
                    }
                );
            }
        });        
    }

    const onLocalizacao = (local) => {
        setLocalizacao(
            locais.filter((item) => {
                return local === item.codigo;
            })[0]            
        );
    }

    const onObservacao = (obs) => {
        setObservacao(obs);
    }

/*
    const onTrocarMesa = (mesa) => {
        setMesa(mesa);
    }

    const onTrocarMesaClick = () => {
        setTrocarMesa(true);
    }
*/

    const onCancelarPedidoClick = () => {

        if (isCheckout()) return;

        let url = '';

        if (suite_id || suite)
            url = `/api/order/cart/${login.uuid}/${suite_id || suite}`;
        else 
            url = `/api/order/cart/waiter/${mesa}`;

        //let url = '/api/order/cart/' + (mesa ? ('waiter/' + login.uuid + '/') : '') + (mesa ?? suite_id);

        alerta({ 
            title: 'Atenção!',
            message: 'Cancela o pedido?',
            onYes: () => { 
                api.delete(`${url}/todos`).then(
                    response => { 
                        setCarrinho(response.data);
                        setMesaAtual(null);
                        onCarrinhoVazio();
                    }
                )
            }
        });

    }

    const Painel = ({total}) => {

        const NumeroMesa = ({mesa}) => {
            if (!mesa) return '';
            return (
                <div className="numero-mesa">Mesa: {mesa}</div>
            );
        }

        const NumeroSuite = ({suite}) => {
            if (!suite) return '';
            return (
                <div className="numero-mesa">Suite: {suite}</div>
            );
        }

        return(
            <div className="container-product-info">

                <div style={{overflow: 'hidden'}}>
                    <NumeroMesa mesa={mesa} />
                    <NumeroSuite suite={suite} />
                    <div className="total-carrinho">Total: {getPreco(total)}</div>
                </div>

                <a className="fecha-pedido" href="#" onClick={onEnviarPedidoClick} 
                    style={{color: 'white'}}>
                    Enviar Pedido
                </a>

                <a className="cancela-pedido" href="#" onClick={onCancelarPedidoClick} 
                    style={{color: 'white'}}>
                    Cancelar Pedido
                </a>
                
                <br />
                
            </div>
        )
    }

    const Itens = ({items, onListaVazia}) => {

        if (items.length === 0) {
            onListaVazia();
            return '';
        }

        return(
            items.map(item => 
                <div type="button" 
                    onClick={() => onItemClick(item)}
                    key={item.id} 
                    className="products">
                    <div style={{paddingBottom: '10px'}}>        
                        <p style={{fontSize:14, color:'#a2a276'}}>Nº {item.codigo}</p>
                        <p style={{color:'#3fe799', fontSize:16}}>{item.descricao}</p>
                        <p style={{fontSize:14, width: 300}}>{item.nota}</p>
                        <p style={{fontSize:18}}>
                            <span style={{color:'#8c8c8c'}}>{getPreco(item.preco, item.quantidade)}</span>
                        </p>
                        {
                            item.atendido ? '' : <p className="toque" style={{fontSize:14}}>Toque para excluir</p>
                        }
                    </div>
                </div>
           )
        )

    };

    return (
        <div>
            { 
                mensagem ? (

                    <SemItensStyle>{mensagem}</SemItensStyle>

                ) : (

                    <div>

                        <Itens 
                            items={carrinho.items} 
                            onListaVazia={
                                () => { setMensagem('Sem ítens!') }
                            } />

                        <LocalEntrega 
                            cardapio={cardapio}
                            locais={locais}
                            onLocalizacao={onLocalizacao} 
                            onObservacao={onObservacao} />

                        <Painel total={carrinho.total} />

                    </div>

                ) 
            }
        </div>
    )
}

const SemItensStyle = styled.p`
    display: flex;
    justify-content:center;
    align-items:center;
    font-size: 25px;
`;

/*
                    <div className="products-image">
                        <img className="product-img" src={`https://api-sistema-mde.herokuapp.com/api/order/photo/${item.foto}`} alt=""/>
                    </div>

*/
