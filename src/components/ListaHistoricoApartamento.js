//import '../styles/Requests.css';
import getPreco from '../utils/getPreco';
import styled from 'styled-components';
import api from '../services/api';
import React, {useState, useEffect} from 'react';
export const ListaHistoricoApartamento = ({id, apartamento}) => {
    const [items, setItems] = useState([])
    useEffect(() => {
        preencherHistorico();
    }, [apartamento])
    function formatarData(dataString) {
        // Cria um objeto Date com a string fornecida
        var data = new Date(dataString);
      
        // Obtém os componentes individuais da data
        var dia = adicionaZero(data.getDate());
        var mes = adicionaZero(data.getMonth() + 1); // Os meses começam do zero
        var ano = data.getFullYear();
        var horas = adicionaZero(data.getHours());
        var minutos = adicionaZero(data.getMinutes());
        var segundos = adicionaZero(data.getSeconds());
      
        // Monta a string formatada
        var dataFormatada = `${dia}/${mes}/${ano} - ${horas}:${minutos}:${segundos}`;
      
        return dataFormatada;
      }
      
      function adicionaZero(numero) {
        return numero < 10 ? '0' + numero : numero;
      }
      const preencherHistorico = async () => {
        const data = (await api.get(`/api/historico/${id}/${apartamento}`)).data[0]
        setItems(data)
    }  
    
    const renderSemItens = () => (        
        <SemItensStyle>Sem itens!</SemItensStyle>        
        )

    if (!items || items.length === 0) {
        return renderSemItens()
    };

    return <Body>
            {items.map((item) => (
                <div type="button" 
                key={item.Comanda} 
                className="products">
                <div style={{padding: '10px', width: '100%'}}>
                    <div>
                        <div style={{float:'left', width: '70%'}}>
                            <p style={{fontSize:14, marginBottom: '5px', color:'#a2a276'}}>Nº {item.PkProduto}</p>
                            <p style={{color:'#3fe799', marginBottom: '5px', fontSize:16, maxWidth: 190}}>{item.NomeProduto}</p>
                            <p style={{fontSize:16, marginBottom: '5px',}}>{getPreco(item.Preco)}</p>
                            <p style={{fontSize:16, marginBottom: '5px',}}>Quantidade: {item.Qtde}</p>
                            <p style={{fontSize:16, marginBottom: '5px',}}>{formatarData(item.HrLan)}</p>
                        </div>
                    </div>
                    <div>
                        <p style={{fontSize:14, width: '200px'}}>N° da comanda: {item.Comanda}</p>
                    </div>
                </div>
            </div>
            ))}
        </Body>;
}

const SemItensStyle = styled.p`
    display: flex;
    justify-content:center;
    align-items:center;
    font-size: 25px;
`;

const Body = styled.div`
    max-height: 70vh;
    overflow-y: auto;
    /* Barra de rolagem para navegadores WebKit (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 4px; /* Largura da barra de rolagem */
  }

  &::-webkit-scrollbar-thumb {
    background-color: #3498db; /* Cor do "polegar" (a parte móvel da barra de rolagem) */
    border-radius: 6px; /* Raio da borda do "polegar" */
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1; /* Cor da trilha (a parte fixa da barra de rolagem) */
  }

  /* Barra de rolagem para navegadores baseados no Firefox */
  &::-moz-scrollbar {
    width: 12px; /* Largura da barra de rolagem */
  }

  &::-moz-scrollbar-thumb {
    background-color: #3498db; /* Cor do "polegar" */
    border-radius: 6px; /* Raio da borda do "polegar" */
  }

  &::-moz-scrollbar-track {
    background-color: #f1f1f1; /* Cor da trilha */
  }
`