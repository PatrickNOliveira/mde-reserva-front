import React, { useEffect, useState } from 'react';
import ListaItensCarrinho from './ListaItensCarrinho';
import getPreco from '../utils/getPreco'
import '../styles/product.css';
import alerta from '../utils/alertas';
import api from '../services/api';

export default function MostraCarrinho({suite_id}) {

    const [carrinhoAtual, setCarrinhoAtual] = useState([]);
    
    return (
        <div>
            <ListaItensCarrinho 
                carrinho={carrinhoAtual} 
                onUpdate={(carrinho) => { 
                    setCarrinhoAtual(carrinho); 
                }} />
        </div>
    );
        
};