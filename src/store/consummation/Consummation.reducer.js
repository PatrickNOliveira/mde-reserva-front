//import api from '../../services/api';

//Esse é o estado inicial, ou seja, assim que o Componente abriu e não consultou nada.
const initial_state = {
  id: "",
  total: 0,
  pedidos: [
    {
      id: 0,
      numero: "0",
      realizado: "",
      atendido: "",
      total: 0,
      produtos: [
        {
          produto: "",
          tipo: "",
          quantidade: "0",
          preco: "0",
          total: 0,
          nota: "",
          id: 0,
        }
      ],
    }
  ]
};

//Aqui cria-se um TYPE somente para ficar fácil de usar o mesmo nome nas actions.
export const actionsTypes = {
  GET_CONSUMMATIONS: 'CONSUMMATIONS/GET',
  INSERT_ORDER: "CONSUMMATIONS/INSERT_ORDER",
  DELETE_ORDER: "CONSUMMATIONS/DELETE_ORDER"
};

//Aqui está listando todas as actions de consummations
export const actions = {
  //Essa é a primeira action, que recebe o consumer por parametro para buscar suas consumações na API.
  getConsummations: payload => {
    return ({
      //Esse aqui é o TYPE ali de cima, ou seja é uma action que Busca.
      type: actionsTypes.GET_CONSUMMATIONS,
      //O Payload é o resultado da api que vai ser usado no reducer, ou seja no estado global.
      payload
    });
  },
  insertOrder: payload => {
    return ({
      type: actionsTypes.INSERT_ORDER,
      payload
    })
  }, 
  deleteOrder: payload => {
    return({
      type: actionsTypes.DELETE_ORDER,
      payload
    })
  }
};

//Esse é o reducer em si, cada CASE, é referente a uma action.
const consummationReducer = (state = initial_state, action) => {
  switch (action.type) {
    //Esse actions chamará a action ali de cima, recebendo um valor no PAYLOAD.
    case actionsTypes.GET_CONSUMMATIONS:
      //Aqui ele verificou qual é a action, e seta no estado global, a resposta do Payload.
      return action.payload;
    case actionsTypes.INSERT_ORDER:
      let novoState = state;
      let novasOrdens = state.orders;
      novasOrdens.push(action.payload);
      novoState.orders = novasOrdens;
      return novoState;
    default:
      //Por padrão se não tiver alteração o reducer devolve o state já existente.
      return state
  }
};

export default consummationReducer;