import {Response, Router} from 'express';
import authenticate from '../../middleware/authenticate.middleware';
import TypedRequest from '../../types/TypedRequest';
import UserModel from '../../models/User.model';
import User, {Permissions} from '../../models/types/user';
import Product from '../../models/types/product';
import ProductModel from '../../models/Product.model';

const router = Router();
router.get('/', [authenticate({skipRes: true})], async(req: TypedRequest<{user?: User}>, res: Response) => {
    if (!req.user) return res.redirect('/login');
    const products = await UserModel.findOne({email: req.user.email}).populate<Array<Product>>('products').orFail().then(doc => doc.products);
    if (req.user.permission >= Permissions.ADMIN){
        const allProducts = await ProductModel.find({}).lean();
        return res.render('products', {account: {admin: true, ...req.user}, products, allProducts});
    }
    return res.render('products', {account: req.user, products});
});

export default router;