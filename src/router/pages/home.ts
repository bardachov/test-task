import {Request, Response, Router} from 'express';
import ProductsModel from '../../models/Products.model';

const router = Router();
router.get('/', async(req: Request, res: Response) => {
    const products = (await ProductsModel.find({})).map(product => {
        const {id, name, description, price, image} = product;
        return {id, name, description, price, image};
    });
    return res.render('index', {products});
});

export default router;