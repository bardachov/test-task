import {Router} from 'express';
import config from '../config/config';
import PhotosCDN from './cdn/photos';

const cdn = Router();

cdn.use('/photos', PhotosCDN);

export default cdn;