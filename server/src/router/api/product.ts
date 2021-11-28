import {Router} from 'express';
import rateLimit from 'express-rate-limit';
import {body} from 'express-validator';
import authenticate from '../../middleware/authenticate.middleware';
import validator from '../../middleware/validator.middleware';
import ProductController from '../../controllers/product.controller';

const router = Router();

router.post(
    '/create',
    [
        //u can register only 2 accounts in 1h window 
        rateLimit({
            windowMs: 60 * 2 * 1000,
            max: 5,
            message: JSON.stringify({message: 'Too many requests, please try again later.'})
        }),
        body('price', 'The price should be a number.')
            .notEmpty()
            .isNumeric(),
        body('name', 'name must be more than 3 and less than 32 characters')
            .notEmpty()
            .isString()
            .isLength({min: 3, max: 32}),
        body('image', 'image required')
            .notEmpty()
            .isString(),
        validator,
        authenticate()
    ],
    ProductController.create
);

export default router;