import {Router} from 'express';
import config from '../config/config';
import ProductAPI from './api/product';
import UserAPI from './api/user';

const api = Router();


api.use('/products', ProductAPI);
api.use('/user', UserAPI);

export default api;