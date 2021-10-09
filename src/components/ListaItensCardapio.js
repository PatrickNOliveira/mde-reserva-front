//import '../styles/Requests.css';
import getPreco from '../utils/getPreco';
import styled from 'styled-components';

export default function ListaItensCardapio({pesquisa, items, onItemClick, grupo}) {
    
    const renderSemItens = () => (        
        <SemItensStyle>Sem itens!</SemItensStyle>        
        )

    if (!items || items.length === 0) return renderSemItens();

    const busca = items.filter((i) => {
        function naPesquisa(i) {
            function contain(a, b) { return a.toUpperCase().includes(b.toUpperCase())}
            if (pesquisa.trim().lenght === 0) return true;
            return contain(i.descricao, pesquisa) || contain(i.codigo, pesquisa);
        }

        function noGrupo(i) {
            return i.tipo == grupo;
        }

        return naPesquisa(i) && noGrupo(i);

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
                        <p style={{color:'#3fe799', fontSize:16, maxWidth: 190}}>{item.descricao}</p>
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