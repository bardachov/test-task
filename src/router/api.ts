import {Router} from 'express';
import config from '../config/config';
import ProductAPI from './api/products';
 
const api = Router();

//only for developer mode
if (config.node === 'development') api.use('/products', ProductAPI);

export default api;