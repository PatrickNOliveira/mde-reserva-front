import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory, useParams } from 'react-router-dom';
import { BsArrowLeftShort } from "react-icons/bs";
import getPreco from '../utils/getPreco'
import api from '../services/api';
import Counter from './Counter';

import { getLogin, getConta, setLogin,
         getMesaAtual, setMesaAtual, 
         getSuiteAtual, setSuiteAtual, contaEncerrada
} from '../utils/utils-context';

export default function AdicionaItem() {

    const isCheckout = () => {
        if (contaEncerrada(login)) {
            setLogin(null);
            history.push({ pathname: `/${id}` });
            return true;
        }
    }

    useEffect(() => {
        //if (login == null) history.push({ pathname: `/entrar/${id}` });
        if (login == null) history.push({ pathname: `/${id}` });
        if (isCheckout()) return;
    },[]);

    const { id }  = useParams();
    const [login] = useState(getLogin());
    const [conta] = useState(getConta());

    const { item } = useLocation();

    const history = useHistory();
    
    const [ produto ] = useState(item);
    const [ quant, setQuant ] = useState(1);
    const [ nota, setNota ] = useState('');
    const [ mesa, setMesa ] = useState(getMesaAtual());
    const [ suite, setSuite ] = useState(getSuiteAtual());

    const atualizaQuantidade = (value) => {
        var q = quant + value;
        setQuant(q > 0 ? q : 1);
    }

    const onAdicionaItem = () => {
        
        if (isCheckout()) return;

        api.post('/api/order', { 
            uuid: id,
            mesa: mesa ?? null,
            funcionario: login.login,
            funcionario_id: login.funcionario_id ?? '0',
            suite_id: login.suite_id ?? '',
            suite: login.suite ?? mesa, 
            codigo: produto.codigo,
            descricao: produto.descricao,
            foto: produto.foto,
            produto_id: produto.id, 
            preco: produto.preco, 
            tipo:produto.tipo,
            quantidade: quant, 
            nota: nota,
            hospede: login.NrHospede
        }).then(response => {
            setMesaAtual(mesa);
            setSuiteAtual(suite);
            onVoltarClick();
        });
    }

    const onVoltarClick = () => {
        history.push({ pathname: `/cardapio/${id}` });     
    }
    
    return (
        <div className="root">
            <div className="header">
                <div  className="header-content">
                    <Link to="#" onClick={onVoltarClick}>
                        <BsArrowLeftShort type="button" className="seta" />
                    </Link>               
                </div>
                <h1 style={{ fontSize: 22  }}>Adicionar Item</h1>
            </div>
            <div className="body">

                <div className="container-product-info">

                    <h2 style={{ fontSize: 20, marginTop: '60px', textAlign: 'center' }}>
                        {produto.descricao}
                    </h2>

                    <h2 style={{
                        fontSize:25, 
                        color: 'lightgreen', 
                        marginTop: '30px', 
                        textAlign: 'center'}}>
                        {getPreco(produto.preco * quant)}
                    </h2>
                    {
                        produto.nota ? 
                            <h3 style={{fontSize:14, padding: '20px'}}>{produto.nota}</h3>
                        : ''
                    }

                    <Counter value={quant} onUpdate={atualizaQuantidade} />

                    <textarea className="nota"
                        type="text" 
                        value={nota} 
                        placeholder="Observações"
                        onChange={(event) => {setNota(event.target.value)}} />

                    {
                        conta.sistema === 'WINRESTA' ? (
                            <div>
                                <input 
                                    className="mesa"
                                    type="text" 
                                    value={mesa}
                                    onChange={(event) => {setMesa(event.target.value)}}
                                    placeholder="Mesa" />
                            </div>
                        ) : ('')
                    }

                    {
                        login.perfil === 'camareira' ? (
                            <div>
                                <input 
                                    className="mesa"
                                    type="text" 
                                    value={suite}
                                    onChange={(event) => {setSuite(event.target.value)}}
                                    placeholder="Suite" />
                            </div>
                        ) : ('')
                    }

                    <a  className="adicionar-item" 
                        href="#" 
                        onClick={onAdicionaItem} 
                        style={{color:'white'}}>Adicionar
                    </a>   

                </div>

            </div>
        </div>
    );

}

/*
                    {
                        produto.foto ? 
                        <div className="img-product-des">
                            <img className="product-img-description" 
                                src={`https://api-sistema-mde.herokuapp.com/api/order/photo/${produto.foto}`} 
                                alt="" />
                        </div>
                        : ''
                    }

*/