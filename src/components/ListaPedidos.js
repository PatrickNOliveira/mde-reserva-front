import getPreco from '../utils/getPreco'
import { BsArrowLeftShort } from "react-icons/bs";

export default function ListaPedidos({pedidos, onVoltarClick, onItemClick}) {
    
    function Descricao({pedido}) {

        const getDia = (pedido) => {
            return pedido.realizado;
        }

        /*
        const getMais = (pedido) => {
            if (pedido.items.length === 1)
                return '';
            let itens = (pedido.items.length - 1);
            itens += itens > 1 ? ' itens' : ' item';
            return '...e mais ' + itens + '.';
        }
        */

        const getSituacao = (pedido) => {
            if (pedido.atendido) return 'ATENDIDO EM';
            return 'EM ATENDIMENTO';
        }

        return(
            <div>
                <p style={{fontSize:18}}>{getSituacao(pedido)}</p>
                <p style={{fontSize:18}}>{getDia(pedido)}</p>
                <p style={{fontSize:14}}>{getPreco(pedido.total)}</p>
                <p className="toque" style={{fontSize:14}}>Toque para detalhes</p>
            </div>
        );
    }

    // <p style={{fontSize:14}}>{pedido.items[0].descricao}</p>
    // <p style={{fontSize:14}}>{getMais(pedido)}</p>

    return (
        <div className="root">
            <div className="header">
                <div  className="header-content">
                    <BsArrowLeftShort  onClick={onVoltarClick} className="seta" type="button"  /> 
                </div>
                <h1>Pedidos</h1>
            </div>    
            <div className="body">
                <div className="lista_pedidos">
                    {
                        pedidos.map(pedido => {
                            if (pedido.items.length === 0) return '';
                                return (
                                    <div 
                                        type="button" 
                                        key={pedido.id}
                                        className="products"
                                        onClick={() => onItemClick(pedido)}>

                                        <Descricao pedido={pedido} />

                                        <div className="box"></div>

                                    </div>
                                )
                            })
                    }
                </div>
            </div>        
        </div>
    )
}

//<img className="product-img" 
//src={`https://api-sistema-mde.herokuapp.com/api/order/photo/${pedido.items[0]}`} alt=""/>
