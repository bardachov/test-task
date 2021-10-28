import {Router} from 'express';
import ProductAPI from './api/products';
 
const api = Router();

api.use('/products', ProductAPI);

export default api;