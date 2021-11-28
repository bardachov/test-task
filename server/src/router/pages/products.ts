import {Response, Router} from 'express';
import authenticate from '../../middleware/authenticate.middleware';
import TypedRequest from '../../types/TypedRequest';
import UserModel from '../../models/User.model';
import User from '../../models/types/user';
import Product from '../../models/types/product';

const router = Router();
router.get('/', [authenticate({skipRes: true})], async(req: TypedRequest<{user?: User}>, res: Response) => {
    if (!req.user) return res.redirect('/login');

    const products = await UserModel.findOne({email: req.user.email}).populate<Array<Product>>('products').orFail().then(doc => doc.products);
    return res.render('products/index', {account: req.user, products});
});

router.get('/create', [authenticate({skipRes: true})], async(req: TypedRequest<{user?: User}>, res: Response) => {
    if (!req.user) return res.redirect('/login');
    return res.render('products/create', {account: req.user});
});

export default router;