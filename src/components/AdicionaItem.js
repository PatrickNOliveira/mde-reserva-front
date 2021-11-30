import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory, useParams } from 'react-router-dom';
import { BsArrowLeftShort } from "react-icons/bs";
import { FaBed } from "react-icons/fa";
import getPreco from '../utils/getPreco'
import api from '../services/api';
import Counter from './Counter';
import styled from 'styled-components';

import { getLogin, getConta, setLogin, getHost, 
         getMesaAtual, setMesaAtual, 
         getSuiteAtual, setSuiteAtual, contaEncerrada,
         getCardapioAtual, setApartamentoAtual, getApartamentoAtual
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
        if (!login.login) return;
        api.get(`/api/rooms/${login.uuid}`).then(response => {
            setApartamentos(
                response.data.sort((a,b) => {
                    return (a.id < b.id) ? -1 : 1;
                })
            );
        });

    },[]);

    const { id }  = useParams();
    const [login] = useState(getLogin());
    const [conta] = useState(getConta());

    const { item } = useLocation();

    const history = useHistory();
    
    const [ produto ] = useState(item);
    const [ mesa, setMesa ] = useState(getMesaAtual());
    const [ suite, setSuite ] = useState(getSuiteAtual());
    const [ adicionado, setAdicionado ] = useState(false);

    const [ apartamento , setApartamento ] = useState(getApartamentoAtual().id);

    const [ detalheItem, setDetalheItem ] = useState(
        (produto.nota || produto.imagem) && !login.login
    );
    
    const [ apartamentos, setApartamentos ] = useState([]);
    const [ buscaApartamentos, setBuscaApartamentos ] = useState(
        login.login ? getApartamentoAtual().id == 0 : false
    );

    const host = getHost();

    const onVoltarClick = () => {
        history.push({ pathname: `/cardapio/${id}`, busca: false });     
    }

    const onBuscaApartamentoClick = () => {
        setBuscaApartamentos(true);
    }

    const onApartamentoClick = (ap) => {
        setApartamentoAtual(ap);
        setApartamento(ap.id);
        setBuscaApartamentos(false);
    }

    const MostraApartamentos = () => {

        return (
            <Apartamento>
                {
                    apartamentos.map((ap, i) => 
                            <a className="botao-apartamento" 
                                key={i}
                                href="#" 
                                onClick={ () => onApartamentoClick(ap) } 
                                style={{color:'black'}}>{ap.id}
                            </a> 
                    )
                }
            </Apartamento>
        );
    }

    const DetalheItem = () => {

        const onContinuarClick = () => {
            setDetalheItem(false);
        }

        // <img src={`${host}/api/foto/${item.id}`}  alt="foto" />

        return (
            <Container>
                <ImgContainer>
                    <img src={produto.imagem}  alt="foto" />
                </ImgContainer>
                <div className="container-product-detail">
                    <h2 style={{ fontSize: 20, textAlign: 'center' }}>
                        {produto.descricao}
                    </h2>
                    <h2 style={{fontSize: 15, marginTop: 20}}> {produto.nota}
                    </h2>
                </div>
                <a  className="continuar-item" 
                    href="#" 
                    onClick={onContinuarClick} 
                    style={{color:'white'}}>Continuar
                </a>
                <br />
            </Container>
        )
    }

    const AdicionaItem = () => {

        const [ quant, setQuant ] = useState(1);
        const [ nota, setNota ] = useState('');
    
        const atualizaQuantidade = (value) => {
            var q = quant + value;
            setQuant(q > 0 ? q : 1);
        }
    
        const onAdicionaItem = () => {
        
            if (isCheckout()) return;
    
            if (adicionado) return;
            
            setAdicionado(true);
            
            const cardapio = getCardapioAtual();
            const apartamento = getApartamentoAtual();

            api.post('/api/order', { 
                uuid: id,
                mesa: mesa ?? null,
                funcionario: login.login,
                funcionario_id: login.funcionario_id ?? '0',
                suite_id: login.suite_id ?? 0,
                suite: login.suite ?? apartamento.id, //, mesa, 
                codigo: produto.codigo,
                descricao: produto.descricao,
                foto: produto.foto,
                produto_id: produto.id, 
                preco: produto.preco, 
                tipo:produto.tipo,
                quantidade: quant, 
                nota: nota,
                hospede: login.NrHospede ?? apartamento.NrHospede,
                cardapio: cardapio.id
            }).then(response => {
                setMesaAtual(mesa);
                setSuiteAtual(suite);
                onVoltarClick();
            });
        }
    
        return (
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

                    <Counter value={quant} onUpdate={atualizaQuantidade} />
                    
                    <textarea className="nota"
                        type="text" 
                        value={nota} 
                        placeholder="Observações"
                        onChange={(event) => { setNota(event.target.value) }} />

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
        )

    }

    const descricao = apartamento == 0 ? 'Selecione apartamento' : 'Apartamento ' + apartamento;

    return (
        <div className="rooms">
            <div className="header">
                <div  className="header-content">
                    <BsArrowLeftShort onClick={onVoltarClick} className="seta" type="button"  /> 
                    {
                        login.login ?
                            <FaBed onClick={onBuscaApartamentoClick} className="cama" type="button"  /> 
                            : ''
                    }
                </div>
                <div>
                    <span className="nome_cardapio">Adicionar Item</span>
                    {
                        login.login ? 
                            <span className="tipo_cardapio">{descricao}</span>
                        : ''
                    }
                </div>                    
            </div>
            {
                buscaApartamentos ? <MostraApartamentos /> :
                (detalheItem ? <DetalheItem /> : <AdicionaItem />)
            }
        </div>
    );

}

const Container = styled.div`
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 80vh;
`;

const ImgContainer = styled.div`
`;

const Apartamento = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-top: 40px;
  `;

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