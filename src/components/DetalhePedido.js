import { BsArrowLeftShort } from "react-icons/bs";
import ListaItensPedido from './ListaItensPedido';

export default function DetalhePedido({pedido, onVoltarClick}) {
    return(
        <div className="root">
            <div className="header">
                <div  className="header-content">
                    <BsArrowLeftShort onClick={onVoltarClick} type="button" className="seta" />
                </div>
                <h1 style={{ fontSize: 22 }}>Detalhe do Pedido</h1>
            </div>    
            <div className="body">
                <div className="lista_pedidos">
                    <ListaItensPedido items={pedido.items} />
                </div>
            </div>        
        </div>
    );
}