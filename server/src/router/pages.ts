import {Router} from 'express';
import HomePage from './pages/home';
 
const pages = Router();

pages.use('/', HomePage);

export default pages;