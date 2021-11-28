import {Router} from 'express';
import rateLimit from 'express-rate-limit';
import {body} from 'express-validator';
import validator from '../../middleware/validator.middleware';
import userController from '../../controllers/user.controller';

const router = Router();

router.post(
    '/register',
    [
        //u can register only 2 accounts in 1h window 
        rateLimit({
            windowMs: 60 * 60 * 1000,
            max: 2,
            message: JSON.stringify({message: 'Too many requests, please try again later.'})
        }),
        body('password', 'Password must be at least 6 characters and no more than 32')
            .notEmpty()
            .isString()
            .isLength({min: 6, max: 32}),
        body('email', 'email is required')
            .notEmpty()
            .isEmail(),
        validator
    ],
    userController.register
);

router.post('/login',
    [
        rateLimit({
            windowMs: 60 * 1000,
            max: 5,
            message: JSON.stringify({message: 'Too many requests, please try again later.'})
        }),
        body('password', 'Password must be at least 6 characters and no more than 32')
            .notEmpty()
            .isString()
            .isLength({min: 6}),
        body('email', 'email is required')
            .notEmpty()
            .isEmail(),
        validator
    ],
    userController.login
)

export default router;