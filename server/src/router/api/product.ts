import {Request, Response, Router} from 'express';
import ProductsModel from '../../models/Product.model';
import Product from '../../models/types/product';
import UserModel from '../../models/User.model';
import User from '../../models/types/user';
import authenticate from '../../middleware/authenticate.middleware';
import TypedRequest from '../../types/TypedRequest';
import rateLimit from 'express-rate-limit';
import {body, query} from 'express-validator';
import validator from '../../middleware/validator.middleware';
const router = Router();

router.get('/',
    [
        rateLimit({max: 5, windowMs: 2000}),
        query('id', 'Invalid product ID').notEmpty().isString().isLength({min: 8}),
        validator,
        authenticate()
    ],
    async (req: TypedRequest<{user?: User}>, res: Response) => {
        try{
            if (!req.user) return res.status(401).json({message: '401: Unauthorized'});
        }catch(server_error){
            return res.status(500).json({message: 'Something went wrong...'});
        }
    }
)

export default router;