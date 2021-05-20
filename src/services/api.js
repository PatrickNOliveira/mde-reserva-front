import axios from 'axios';
import { getHost } from '../utils/utils-context';

const api = axios.create({
    //baseURL: 'http://localhost:8000',
    baseURL: getHost(), //'https://api-sistema-mde.herokuapp.com/', 
    withCredentials: false,
    headers: { 
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },  
})

export default api;


