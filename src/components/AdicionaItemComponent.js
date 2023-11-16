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
        }).catch(e => {
            setMesaAtual(mesa);
            setSuiteAtual(suite);
            onVoltarClick();
        });
    }

    const preencherHistorico = async () => {
        const data = (await api.get(`/api/historico/${id}/${apartamento}`)).data[0]
        setHistorico(data)
    }
    
    const onConsultaHistorico = () => {
        alerta({ 
            title: 'Histórico',
            message: <><ListaHistoricoApartamento items={historico} /></>,
            onOk: () => { 
                console.log('Confirmar')
            }
        })
    }

    useEffect(() => {
        preencherHistorico();
    }, [apartamento])

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

                <a  className="consultar-historico" 
                    href="#" 
                    onClick={onConsultaHistorico} 
                    style={{color:'white'}}>Consultar histórico
                </a> 

                <a  className="adicionar-item" 
                    href="#" 
                    onClick={onAdicionaItem} 
                    style={{color:'white'}}>Adicionar
                </a>  

            </div>
        </div>
    )

}
