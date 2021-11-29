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
            body('name', 'Name must be more than 3 and less than 32 characters')
                .notEmpty()
                .isString()
                .isLength({min: 3, max: 32}),
            body('image', 'Image required')
                .notEmpty()
                .isString(),
            body('description', 'Description must be less than 2048 characters')
                .isString()
                .isLength({max: 2048}),
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
            body('id')
                .notEmpty()
                .isString(),
            authenticate()
        ],
        ProductController.delete
    )
    .patch(
        [
            body('description', 'Description must be less than 2048 characters')
                .optional({nullable: true})
                .isString()
                .isLength({max: 2048}),
            body('image', 'image is only string value')
                .optional({nullable: true})
                .isString(),
            body('name', 'Name must be more than 3 and less than 32 characters')
                .optional({nullable: true})
                .isString()
                .isLength({min: 3, max: 32}),
            body('price', 'price is only number value')
                .optional({nullable: true})
                .isNumeric(),
            body('id', 'Invalid product id')
                .isString(),
            validator,
            authenticate()
        ],
        ProductController.update
    )

export default router;