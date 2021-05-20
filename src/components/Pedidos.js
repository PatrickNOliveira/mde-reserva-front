import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import api from '../services/api';
import { getLogin } from '../utils/utils-context';
import MostraComanda from './MostraComanda';
import MostraPedidos from './MostraPedidos';

export default function Pedidos() {
    
    const { id } = useParams();
    const [login] = useState(getLogin());
    const history = useHistory();

    const [pedidos, setPedidos] = useState([]);
    const [mesa, setMesa] = useState();

    useEffect(() => {

        if (login == null) history.push({ pathname: `/entrar/${id}` });

        if (!login.suite_id && !mesa) {
            return;
        }

        let mounted = true;

        let url = '/api/order/consumer/';
        url += login.suite_id ? login.suite_id : `waiter/${login.uuid}/${mesa}`;

        api.get(url).then(response => {

            if (!mounted) return;

            setPedidos(response.data);

        }).catch(() => {

            setPedidos([]);

        });

        return function cleanup() {
            mounted = false;
        }

    },[mesa]);

    const onPesquisarMesa = (mesa) => {
        setMesa(mesa);
    }

    const onTrocarItemMesa = (item, nova_mesa) => {
        api.post(`/api/mesa/${id}/${item.id}/${mesa}/${nova_mesa}`).then(response => {
            setPedidos(response.data);
        }).catch(() => {
            setPedidos([]);
        });        
    }

    return(

        login.login 
            ?
                <MostraComanda mesa={mesa} comanda={pedidos} 
                    onPesquisarMesa={onPesquisarMesa} 
                    onTrocarItemMesa={onTrocarItemMesa} />
            :
                <MostraPedidos pedidos={pedidos} />
    )
}
