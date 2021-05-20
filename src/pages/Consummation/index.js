import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../store/consummation/Consummation.reducer'
import { BsArrowLeftShort } from "react-icons/bs";
import { BsChevronDown } from "react-icons/bs";
import { BsChevronUp } from "react-icons/bs";
import { useHistory } from 'react-router-dom';
import { BsFillTrashFill } from "react-icons/bs";

import api from '../../services/api';

import '../../styles/consummation.css';

function Consummation() {

  const dispatch = useDispatch();

  const consummations = useSelector(state => state.consummations);

  const [infoOpen, setInfoOpen] = useState(0)

  const [orders, setOrders] = useState([]);

  const { goBack } = useHistory();

  const getConsummations = async () => {
    const response = await api.get(`/api/order/consumer/0`);
    dispatch(actions.getConsummations(response.data));
  }

  useEffect(() => {
    getConsummations();
  }, [])

  function handleRemoveRequests(order) {
    api.delete(`/api/order/consumer/0/${order}`)
      .then(function(response) {
      console.log(response.data)
      })

    let newOrders = consummations.orders.filter(
      orderfilter => orderfilter.id !== order
    )    
    let newConsummations = {...consummations, orders : newOrders}
    dispatch(actions.getConsummations(newConsummations)); 
  }

  function inserirOrder() {
    let order = { order: 1234, total: "22" };

    dispatch(actions.insertOrder(order));
  }

  async function handleRemoveItems(consummationsId, order, code) {
    const response = await api.delete(`/api/order/consumer/${consummationsId}/${order}/${code}`)
    console.log(response.data)
    getConsummations()
  }

  const handleToggleInfo = (order) => {
    setInfoOpen(infoOpen === 0 ? order : 0)
  }

  return (
    <div className="root">
      <div className="header">
        <div className="header-content">
          <BsArrowLeftShort type="button" onClick={goBack} style={{ fontSize: 25, color: '#ff9000', marginLeft: 10 }} />
        </div>
        <h1 style={{ fontSize: 22 }} >Openshift</h1>
      </div>
      <div className="body-list">
        <ul>
          {consummations ? (
            consummations.pedidos.map(order =>
              <li key={order.id}>
                <div className="container-pedidos ">
                  <div className="pedidos">
                    <p>Pedido: {order.id}  <BsFillTrashFill type="button" onClick={() => handleRemoveRequests(order.id)} style={{ fontSize: 14, marginLeft: 10 }}/></p>
                    <p>Total: R${order.total}</p>
                  </div>
                  {order.produtos.map(item =>
                    <div key={item.id} className="items" style={{ transition: '0.2s', height: infoOpen === order.id ? "" : "0px", padding: infoOpen === order.id ? 12 : 0 }}>
                      <div className="pcontainer">
                        <div className="first-column">
                          <p>Código: {item.id} <BsFillTrashFill type="button" onClick={() => handleRemoveItems(consummations.id, order.id, item.id)} style={{ fontSize: 9, marginLeft: 10 }}/></p>
                          <p>Item: {item.produto}</p>
                        </div>
                        <div className="second-column">
                          <p>Quantidade: {item.quantidade}</p>
                          <p>Preço: {item.preco}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: 12, display: "flex", justifyContent: 'center' }}>
                    {infoOpen === order.id ?
                      (<BsChevronUp type="button" onClick={() =>handleToggleInfo(order.id)} />) :
                      (<BsChevronDown type="button" onClick={() =>handleToggleInfo(order.id)} />)
                    }
                  </div>
                </div>
              </li>
            )
          ) : (
            <></>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Consummation;