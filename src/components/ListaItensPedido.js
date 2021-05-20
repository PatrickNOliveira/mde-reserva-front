//import '../styles/Requests.css';
import getPreco from '../utils/getPreco'

export default function ListaItensPedido({items}) {
    if (!items || items.length === 0) return 'Sem itens!';
    return items.map(item => 
        <div type="button" 
            key={item.id} 
            className="products">
            <div className="products-info">        
                <p style={{fontSize:12}}>Nº {item.codigo}</p>
                <p style={{fontSize:14}}>{item.descricao}</p>
                <p style={{color: '#3fe799', fontSize:10, width: 200}}>{item.nota}</p>
                <p style={{fontSize:18}}>{getPreco(item.preco)}</p>
            </div>
            <div className="box"></div>            
        </div>
    );
}