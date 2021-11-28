import {Router} from 'express';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import AccountPage from './pages/account';

const pages = Router();

pages.use('/', HomePage);
pages.use('/login', LoginPage);
pages.use('/account', AccountPage);

export default pages;