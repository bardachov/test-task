import {Request, Response, Router} from 'express';
import ProductsModel from '../../models/Product.model';

const router = Router();
router.get('/', async(req: Request, res: Response) => {
    const products = await ProductsModel.find({}).lean();
    return res.render('index', {products});
});

export default router;