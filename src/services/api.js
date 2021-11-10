import axios from 'axios';
import { getHost } from '../utils/utils-context';

const api = axios.create({
    //baseURL: 'http://localhost:8000',
    //baseURL: getHost(),
    baseURL: 'https://api.mde.com.br',
    withCredentials: false,
    headers: { 
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },  
})

export default api;


