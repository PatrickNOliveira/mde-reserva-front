import axios from 'axios';
import { getHost } from '../utils/utils-context';

const host = getHost();

console.log('api.getHost:', host);

const api = axios.create({
    //baseURL: 'http://localhost:8000',
    baseURL: host,
    //baseURL: 'https://api.mde.com.br',
    withCredentials: false,
    headers: { 
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },  
})

export default api;


