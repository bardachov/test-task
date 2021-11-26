import { Request, Response, NextFunction } from 'express'; 
import { validationResult } from 'express-validator';

export default async function validator(req: Request, res: Response, next: NextFunction){
    const errors = validationResult(req);
    return errors.isEmpty() ? next() : res.status(422).json({message: errors.array()[0].msg});
}