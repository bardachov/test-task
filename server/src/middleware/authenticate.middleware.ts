import {NextFunction, Response} from 'express';
import User, { Permissions } from '../models/types/user';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import config from '../config/config';
import UserModel from '../models/User.model';
import TypedRequest from '../types/TypedRequest';

interface authenticateOptions{
    permission?: number,
    skipRes?: boolean//if server get invalid auth jwt, use next without req.user for custom handler
}

export interface ClientJWT{
    email?: string,
    password?: string,
    iat?: number,
    exp?: number
}

export default function authenticate(authOptions?: authenticateOptions){
    const defaultOptions = {
        permission: Permissions.USER,
        skipRes: false
    }
    const options = {...defaultOptions, ...authOptions};
    
    return async function (req: TypedRequest<{user?: User}>, res: Response, next: NextFunction){
        try{
            const token = req.headers.authorization?.split(' ')[1] || req.cookies.authorization?.split(' ')[1];

            if (!token) return options.skipRes 
                ? next() 
                : res.status(401).json({message: '401: Unauthorized'});

            const decodedJWT = await jwt.verify(token, config.secure.jwt) as ClientJWT;
            if (typeof decodedJWT.email != 'string' || typeof decodedJWT.password != 'string') return options.skipRes 
                ? next() 
                : res.status(401).json({message: '401: Unauthorized'});

            const candidate = await UserModel.findOne({email: decodedJWT.email}).lean();
            if (!candidate) return options.skipRes 
                ? next() 
                : res.status(404).json({message: 'Member not found'});

            if (candidate.permission < options.permission) return options.skipRes 
                ? next() 
                : res.status(403).json({message: 'Permission Denied'});

            const payloadPassword = await CryptoJS.AES.decrypt(decodedJWT.password, config.secure.aes).toString(CryptoJS.enc.Utf8);
            const cadidatePassword = await CryptoJS.AES.decrypt(candidate.password, config.secure.aes).toString(CryptoJS.enc.Utf8);
            if (payloadPassword !== cadidatePassword) return options.skipRes 
                ? next() 
                : res.status(401).json({message: '401: unauthorized'});

            req.user = {...candidate, password: cadidatePassword};
            next();
        }catch(err){
            return options.skipRes ? next() : res.status(401).json({message: '401: unauthorized'});
        }
    }
}