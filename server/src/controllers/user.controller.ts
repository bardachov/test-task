import {Request, Response} from 'express';
import UserModel from '../models/User.model';
import CryptoJS from 'crypto-js';
import config from '../config/config';
import jwt from 'jsonwebtoken';

class UserController{
    async register(req: Request, res: Response){
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
    async login(req: Request, res: Response){
        try{
            const {email, password} = req.body;

            const candidate = await UserModel.findOne({email}).lean();
            if (!candidate) return res.status(404).json({message: 'Invalid password or email'});
    
            const decodedPassword = await CryptoJS.AES.decrypt(candidate.password, config.secure.aes).toString(CryptoJS.enc.Utf8);
            if (password !== decodedPassword) return res.status(401).json({message: 'Invalid password or email'});

            const encodedPassword = await CryptoJS.AES.encrypt(password, config.secure.aes).toString();

            const token = jwt.sign({email, password: encodedPassword}, config.secure.jwt, {expiresIn: '24h'});
            return res.status(200).json({token, type: 'Bearer'});
        }catch(server_error){
            return res.status(500).json({message: 'Something went wrong...'});
        }
    }
}

export default new UserController();