import {Request, Response, Router} from 'express';
import rateLimit from 'express-rate-limit';
import {body} from 'express-validator';
import validator from '../../middleware/validator.middleware';
import UserModel from '../../models/User.model';
import User from '../../models/types/user';
import CryptoJS from 'crypto-js';
import config from '../../config/config';
import jwt from 'jsonwebtoken'
import { TypedRequest } from '../../types/TypedRequest';
import authenticate from '../../middleware/authenticate.middleware';
import Product from '../../models/types/product';

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
    async (req: Request, res: Response) => {
        try{
            const {email, password} = req.body;

            const candidate = await UserModel.findOne({email}).lean();
            if (candidate) return res.status(403).json({message: 'User with this email already exists'});
    
            const encodedPassword = await CryptoJS.AES.encrypt(password, config.secure.aes).toString();
            const encodedJWTPassword = await CryptoJS.AES.encrypt(password, config.secure.aes).toString();
            await UserModel.create({email, password: encodedPassword});
            const token = await jwt.sign({email, password: encodedJWTPassword}, config.secure.jwt, {expiresIn: '24h'});
            return res.status(200).json({token, type: 'Bearer'});
        }catch(server_error){
            return res.status(500).json({message: 'Something went wrong...'});
        }
    }
);

router.post('/login',
    [
        rateLimit({windowMs: 60 * 1000, max: 5}),
        body('password', 'Password must be at least 6 characters and no more than 32')
            .notEmpty()
            .isString()
            .isLength({min: 6}),
        body('email', 'email is required')
            .notEmpty()
            .isEmail(),
        validator
    ],
    async (req: Request, res: Response) => {
        try{
            const {email, password} = req.body;

            const candidate = await UserModel.findOne({email}).lean();
            if (!candidate) return res.status(404).json({message: 'User not found'});
    
            const decodedPassword = await CryptoJS.AES.decrypt(candidate.password, config.secure.aes).toString(CryptoJS.enc.Utf8);
            if (password !== decodedPassword) return res.status(401).json({message: '401: unauthorized'});

            const encodedPassword = await CryptoJS.AES.encrypt(password, config.secure.aes).toString();

            const token = jwt.sign({email, password: encodedPassword}, config.secure.jwt, {expiresIn: '24h'});
            return res.status(200).json({token, type: 'Bearer'});
        }catch(server_error){
            return res.status(500).json({message: 'Something went wrong...'});
        }
    }
)

router.get('/products',
    [
        authenticate()
    ],
    async (req: TypedRequest<{user?: User}>, res: Response) => {
        try{
            if (!req.user) return res.status(401).json({message: '401: Unauthorized'});
            const products = await UserModel.findOne({email: req.user.email}).populate<Array<Product>>('products').lean();
            return res.status(200).json(products);
        }catch(server_error){
            return res.status(500).json({message: 'Something went wrong...'});
        }
    }
)


export default router;