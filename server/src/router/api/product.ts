import {Router, Request, Response} from 'express';
import rateLimit from 'express-rate-limit';
import {body, query} from 'express-validator';
import authenticate from '../../middleware/authenticate.middleware';
import validator from '../../middleware/validator.middleware';
import ProductController from '../../controllers/product.controller';
import ProductModel from '../../models/Product.model';

const router = Router();

router.route('/')
    .get(
        [
            rateLimit({
                windowMs: 60 * 1000,
                max: 10,
                message: JSON.stringify({message: 'Too many requests, please try again later.'})
            }),
        ],
        ProductController.read
    )
    .post(
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
            body('image', 'Image required')
                .notEmpty()
                .isString(),
            validator,
            authenticate()
        ],
        ProductController.create
    )
    .delete(
        [
            rateLimit({
                windowMs: 60 * 1000,
                max: 10,
                message: JSON.stringify({message: 'Too many requests, please try again later.'})
            }),
            query('id')
                .notEmpty()
                .isString(),
            authenticate()
        ],
        ProductController.delete
    )

export default router;