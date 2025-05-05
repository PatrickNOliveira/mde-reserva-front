import React, {useEffect, useState} from 'react';
import {Link, useLocation, useHistory, useParams} from 'react-router-dom';
import {BsArrowLeftShort} from "react-icons/bs";
import {FaBed} from "react-icons/fa";
import getPreco from '../utils/getPreco'
import api from '../services/api';
import Counter from './Counter';
import styled from 'styled-components';
import {ListaHistoricoApartamento} from './ListaHistoricoApartamento'

import {
    getLogin, getConta, setLogin, getHost,
    getMesaAtual, setMesaAtual,
    getSuiteAtual, setSuiteAtual, contaEncerrada,
    getCardapioAtual, setApartamentoAtual, getApartamentoAtual
} from '../utils/utils-context';
import alerta from '../utils/alertas';
import {QrCodeLeitor} from "../pages/QrCodeLeitor/QrCodeLeitor";

export default function AdicionaItem() {

    const isCheckout = () => {
        if (contaEncerrada(login)) {
            setLogin(null);
            history.push({pathname: `/${id}`});
            return true;
        }
    }

    useEffect(() => {
        //if (login == null) history.push({ pathname: `/entrar/${id}` });
        if (login == null) history.push({pathname: `/${id}`});
        if (isCheckout()) return;
        if (!login.login) return;
        api.get(`/api/rooms/${login.uuid}`).then(response => {
            const data = response.data.filter(i => {
                return i.SitAtual == 'O';
            });
            setApartamentos(
                data.sort((a, b) => {
                    return (a.id < b.id) ? -1 : 1;
                })
            );
        });

    }, []);

    const {id} = useParams();
    const [login] = useState(getLogin());
    const [conta] = useState(getConta());

    const {item} = useLocation();

    const history = useHistory();

    const [produto] = useState(item);
    const [mesa, setMesa] = useState(getMesaAtual());
    const [suite, setSuite] = useState(getSuiteAtual());
    const [adicionado, setAdicionado] = useState(false);
    const [historico, setHistorico] = useState([])

    const [apartamento, setApartamento] = useState(getApartamentoAtual().id);

    const [detalheItem, setDetalheItem] = useState(
        (produto?.nota || produto?.imagem) && !login.login
    );

    const [apartamentos, setApartamentos] = useState([]);
    const [buscaApartamentos, setBuscaApartamentos] = useState(
        login.login ? getApartamentoAtual().id === 0 : false
    );

    const host = getHost();

    const onVoltarClick = () => {
        history.push({pathname: `/cardapio/${id}`, busca: false});
    }

    const onBuscaApartamentoClick = () => {
        setBuscaApartamentos(true);
    }

    const onApartamentoClick = (ap) => {
        setSuite(ap.id);
        setApartamentoAtual(ap);
        setApartamento(ap.id);
        setBuscaApartamentos(false);
    }

    const MostraApartamentos = () => {

        return (
            <>
                Ou selecione um apartamento:
                <Apartamento>
                    {
                        apartamentos.map((ap, i) =>
                            <a className="botao-apartamento"
                               key={i}
                               href="#"
                               onClick={() => {
                                   onApartamentoClick(ap)
                               }}
                               style={{color: 'black'}}>{ap.id}
                            </a>
                        )
                    }
                </Apartamento>
            </>
        );
    }

    const DetalheItem = () => {

        const onContinuarClick = () => {
            setDetalheItem(false);
        }

        // <img src={`${host}/api/foto/${item.id}`}  alt="foto" />
//                    <img src={produto.imagem}  alt="foto" />

        return (
            <Container>
                <ImgContainer>
                    <img src={produto?.imagem} alt="foto"/>
                </ImgContainer>
                <div className="container-product-detail">
                    <h2 style={{fontSize: 20, marginTop: 30, textAlign: 'center'}}>
                        {produto?.descricao}
                    </h2>
                    <h2 style={{fontSize: 15, marginTop: 20, marginBottom: 20}}>
                        {produto?.nota}
                    </h2>
                </div>
                <a className="continuar-item"
                   href="#"
                   onClick={onContinuarClick}
                   style={{color: 'white'}}>Continuar
                </a>
                <br/>
            </Container>
        )
    }

    const AdicionaItem = () => {
        const [listaObs, setListaObs] = useState([])
        const [quant, setQuant] = useState(1);
        const [nota, setNota] = useState('');
        const [mostrarTextArea, setMostrarTextArea] = useState(false);
        const [obs, setObs] = useState('');
        const [paraDescricaoProd, setParaDescricaoProd] = useState('')
        const [paraValorProd, setParaValorProd] = useState(0)

        const atualizaQuantidade = (value) => {
            var q = quant + value;
            setQuant(q > 0 ? q : 1);
        }
        const obterListaObs = async () => {
            const response = await api.get(`/api/lista-obs/${login.uuid}`)
            setListaObs(response.data)
        }

        useEffect(() => {
            setParaDescricaoProd(produto?.descricao)
            setParaValorProd(produto?.preco * quant)
        }, [produto])

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
                descricao: produto?.descricao,
                foto: produto.foto,
                produto_id: produto.id,
                preco: produto?.preco,
                tipo: produto.tipo,
                quantidade: quant,
                nota: !!obs && obs?.length > 0 ? obs : nota,
                hospede: login.NrHospede ?? apartamento.NrHospede,
                paraDescricao: paraDescricaoProd,
                paraValor: paraValorProd,
                cardapio: cardapio.id
            }).then(response => {
                setMesaAtual(mesa);
                setSuiteAtual(suite);
                onVoltarClick();
            }).catch(e => {
                setMesaAtual(mesa);
                setSuiteAtual(suite);
                onVoltarClick();
            });
        }

        const onConsultaHistorico = () => {
            alerta({
                title: 'Histórico',
                message: <><ListaHistoricoApartamento id={id} apartamento={suite}/></>,
                onOk: () => {
                    console.log('Confirmar')
                }
            })
        }
        useEffect(() => {
            obterListaObs()
        }, [])
        useEffect(() => {
            if (mostrarTextArea === false) {
                setObs('')
            }
        }, [mostrarTextArea])
        return (
            <div className="body">

                <div className="container-product-info">

                    {
                        !produto?.paraDescricao &&
                        <h2 style={{fontSize: 20, marginTop: '60px', textAlign: 'center'}}>
                            {produto?.descricao}
                        </h2>
                    }

                    {
                        !!produto?.paraDescricao && <>
                            <label style={{fontSize: 20, marginTop: '60px', textAlign: 'center'}}>
                                Produto
                            </label>
                            <input className="nota" type="text" value={paraDescricaoProd} onChange={(e) => {
                                setParaDescricaoProd(e.target.value)
                            }}/>
                        </>
                    }

                    {
                        !produto?.paraValor &&
                        <h2 style={{
                            fontSize: 25,
                            color: 'lightgreen',
                            marginTop: '30px',
                            textAlign: 'center'
                        }}>
                            {getPreco(produto?.preco * quant)}
                        </h2>
                    }

                    {
                        produto?.paraValor &&
                        <>
                            <label style={{
                                fontSize: 25,
                                color: 'lightgreen',
                                marginTop: '30px',
                                textAlign: 'center'
                            }}>
                                Valor
                            </label>
                            <input className="nota" type="number" step={0.01} value={paraValorProd} onChange={(e) => {
                                setParaValorProd(e.target.value)
                            }}/>
                        </>
                    }

                    <Counter value={quant} onUpdate={atualizaQuantidade}/>

                    <select className="nota" value={nota} onChange={(event) => {
                        setNota(event.target.value)
                        setMostrarTextArea(event.target.value.toLowerCase() === 'Outros'.toLowerCase())
                    }}>
                        <option value={""}>Observações</option>
                        {
                            listaObs.map(l => (
                                <option key={l.id}>{l.ObsPrato}</option>
                            ))
                        }
                    </select>
                    {mostrarTextArea && <>
                        <label>Descreva</label>
                        <textarea className="nota" onChange={(e) => setObs(e.target.value)} value={obs}>
                        </textarea>
                    </>
                    }

                    {
                        conta.sistema === 'WINRESTA' ? (
                            <div>
                                <input
                                    className="mesa"
                                    type="text"
                                    value={mesa}
                                    onChange={(event) => {
                                        setMesa(event.target.value)
                                    }}
                                    placeholder="Mesa"/>
                            </div>
                        ) : ('')
                    }

                    {
                        /*
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
                        */
                    }

                    <a className="consultar-historico"
                       href="#"
                       onClick={onConsultaHistorico}
                       style={{color: 'white'}}>Consultar histórico
                    </a>

                    <a className="adicionar-item"
                       href="#"
                       onClick={onAdicionaItem}
                       style={{color: 'white'}}>Adicionar
                    </a>

                </div>
            </div>
        )

    }

    const descricao = apartamento == 0 ? 'Selecione apartamento' : 'Apartamento ' + apartamento;
    const dadosAp = getApartamentoAtual();

    return (
        <div className="rooms">
            <div className="header">
                <div className="header-content">
                    <BsArrowLeftShort onClick={onVoltarClick} className="seta" type="button"/>
                    {
                        login.login ?
                            <FaBed onClick={onBuscaApartamentoClick} className="cama" type="button"/>
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
                    <span className="nome_hospede">{dadosAp.NomeHospede}</span>
                </div>
            </div>
            {
                buscaApartamentos ?
                    <>
                        <QrCodeLeitor
                        onLeitura={onApartamentoClick}
                        />
                        <MostraApartamentos/>
                    </>
                    :
                    (detalheItem ? <DetalheItem/> : <AdicionaItem/>)
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