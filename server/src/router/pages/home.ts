import {Request, Response, Router} from 'express';
import authenticate from '../../middleware/authenticate.middleware';
import ProductsModel from '../../models/Product.model';
import TypedRequest from '../../types/TypedRequest';
import User from '../../models/types/user';

const router = Router();
router.get('/', [authenticate({skipRes: true})] ,async(req: TypedRequest<{user?: User}>, res: Response) => {
    const products = await ProductsModel.find({}).lean();
    const user = req.user ? {auth: true, user: req.user} : {auth: false};
    return res.render('index', {products, user});
});

export default router;