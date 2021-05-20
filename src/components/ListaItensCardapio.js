//import '../styles/Requests.css';
import getPreco from '../utils/getPreco';
import styled from 'styled-components';

export default function ListaItensCardapio({pesquisa, items, onItemClick}) {
    
    const rendeSemItens = () => (        
        <SemItensStyle>Sem itens!</SemItensStyle>        
        )

    if (!items || items.lenght === 0) return rendeSemItens();

    const busca = items.filter((i) => {
        function contain(a, b) { return a.toUpperCase().includes(b.toUpperCase())}
        if (pesquisa.trim().lenght === 0) return true;
        return contain(i.descricao, pesquisa) || contain(i.codigo, pesquisa);
    });

    return busca.map(item => 
        <div type="button" 
            onClick={() => onItemClick(item)} 
            key={item.id} 
            className="products">
            <div style={{padding: '10px', width: '100%'}}>
                <div>
                    <div style={{float:'left', width: '70%'}}>
                        <p style={{fontSize:14, color:'#a2a276'}}>Nº {item.codigo}</p>
                        <p style={{color:'#3fe799', fontSize:16}}>{item.descricao}</p>
                    </div>
                    <div style={{float:'right'}}>
                        <p style={{fontSize:18}}>{getPreco(item.preco)}</p>
                    </div>
                </div>
                <div>
                    <p style={{fontSize:14, width: '200px'}}>{item.nota}</p>
                </div>
            </div>
        </div>
    );
}

const SemItensStyle = styled.p`
    font-size: 100px;
`;

/*
    <div className="products-image">
        <img className="product-img" src={`https://api-sistema-mde.herokuapp.com/api/order/photo/${item.foto}`} alt=""/>
    </div>                
*/