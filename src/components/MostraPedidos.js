import { useHistory, useParams } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
import getPreco from '../utils/getPreco';

export default function MostraPedidos({pedidos}) {
    const { id } = useParams();
    const history = useHistory();

    const onMenuClick = () => {
        history.push({ pathname: `/menu/${id}` });
    }

    const getData = (data) => {
        const mes = [
            'janeiro', 'fevereiro', 'março',
            'abril', 'maio', 'junho',
            'julho', 'agosto', 'setembro',
            'outubro', 'novembro', 'dezembro'
        ]

        const dia = data.substr(8,2);

        const i = parseInt(data.substr(5,2));

        return dia + ' de ' + mes[i];
    }

    if (pedidos.length === 0) return '';

    console.log(pedidos);

    return (
        <div className="root">
            <div className="header">
                <div  className="header-content">
                    <BsArrowLeftShort onClick={onMenuClick} className="seta" type="button"  /> 
                </div>
                <h1>Pedidos</h1>
            </div>    
            <div className="body">
                <div className="listaItensPedido">
                    {
                        pedidos.pedidos.map(pedido => {
                            return(
                                <div key={pedido.id} className="item">
                                    <div className="data">{getData(pedido.data)}</div>
                                    <ListaItensPedido items={pedido.items} />
                                </div>
                            )
                        })
                    }
                    <Total total={pedidos.total} />
                </div>
            </div>        
        </div>
    )
    
}

const Total = ({total}) => {
    if (total === 0) 
        return <div className='total'>Não há pedidos!</div>
    return (
        <div className='total'>Total: {getPreco(total)}</div>
    )
};

const ListaItensPedido = ({items}) => {

    const getAtendido = (atendido) => {
        if (atendido === '') return '';
        return 'atendido';
    }

    if (items.length === 0) return '';

    return items.map(item => {
        return (
            <div key={item.id} style={{marginTop: '20px'}}>
                <div style={{overflow: 'hidden'}}>
                    <div className='esquerda'>{item.descricao}</div>
                    <div className='direita'><span className='detalhe'>Nº {item.codigo}</span></div>
                </div>
                <div style={{overflow: 'hidden'}}>
                    <div className='detalhe'>{item.quantidade} x {getPreco(item.preco)}</div>
                    <div className='valor'>{getPreco(item.preco * item.quantidade)}</div>
                </div>
                <div className='atendido'>{getAtendido(item.atendido)}</div>
            </div>
        )
    })
}