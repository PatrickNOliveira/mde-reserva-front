import { createStore, combineReducers } from 'redux';
import consummationReducer from './consummation/Consummation.reducer';

//Aqui combina todos os reducers.
const rootReducer = combineReducers({
  consummations: consummationReducer
});

//Função do proprio redux para criar o Global State.
const store = createStore(rootReducer);

export default store