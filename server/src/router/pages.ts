import {Router} from 'express';
import HomePage from './pages/home';
import LoginPage from './pages/login';
 
const pages = Router();

pages.use('/', HomePage);
pages.use('/login', LoginPage);

export default pages;