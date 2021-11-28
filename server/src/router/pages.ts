import {Router} from 'express';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import ProductsPage from './pages/products';

const pages = Router();

pages.use('/', HomePage);
pages.use('/login', LoginPage);
pages.use('/products', ProductsPage);

export default pages;