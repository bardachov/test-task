import { Response } from "express";
import TypedRequest from "../types/TypedRequest";
import User from "../models/types/user";
import ProductModel from "../models/Product.model";
import UserModel from "../models/User.model";
import cryptoString from "../libs/cryptoString";
import config from '../config/config';

class ProductController{
    async create(req: TypedRequest<{user?: User}>, res: Response){
        try{
            if (!req.user) return res.status(401).json({message: '401: Unauthorized'});
            const UniqueIdentificator = `${Date.now()}-${await cryptoString(12)}.png`;
            const product = await ProductModel.create({
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                image: {
                    filename: UniqueIdentificator,
                    path: `${config.cdn.photos}/${UniqueIdentificator}`,
                    base64encode: req.body.image
                }
            });
            await UserModel.findOneAndUpdate({email: req.user.email}, {$push: {products: product._id}});
            return res.status(200).json({product: product._id.toString()});
        }catch(server_error: any){
            return res.status(4000).json({message: server_error.message});
        }
    }
}

export default new ProductController();