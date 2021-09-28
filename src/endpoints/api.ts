import {Router} from 'express';
import Product from './product';

const router = Router();

router.use('/product', Product)

export default router;