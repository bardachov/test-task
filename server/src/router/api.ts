import {Router} from 'express';
import config from '../config/config';
import ProductAPI from './api/product';
import UserAPI from './api/user';

const api = Router();

//only for developer mode
if (config.node.env === config.node.types.development) api.use('/products', ProductAPI);
if (config.node.env === config.node.types.development) api.use('/user', UserAPI);

export default api;