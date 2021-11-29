import { Request, Response } from "express";
import TypedRequest from "../types/TypedRequest";
import User, {Permissions} from "../models/types/user";
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
    async delete(req: TypedRequest<{user?: User}>, res: Response){
        try{
            if (!req.user) return res.status(401).json({message: '401: Unauthorized'});
            const product = await ProductModel.findById(req.body.id).lean();
            if (!product) return res.status(404).json({message: 'Product not found'});  
            const owner = await UserModel.findOne({products: req.body.id});
            if (!owner) {
                await ProductModel.findByIdAndDelete(req.body.id);
                return res.status(200).json({message: 'Product deleted'});
            }
            if (owner.email != req.user.email && req.user.permission < Permissions.ADMIN) return res.status(403).json({message: 'Permission Denied'});
            await ProductModel.findByIdAndDelete(req.body.id);
            await UserModel.findOneAndUpdate({email: owner.email}, {$pull: {products: req.body.id}});
            return res.status(200).json({message: 'Product deleted'});
        }catch(server_error: any){
            return res.status(400).json({message: server_error.message});
        }
    }
    async read(req: Request, res: Response){
        try{
            const product = await ProductModel.findById(req.query.id).lean();
            if (!product) return res.status(404).json({message: 'Product Not Found'});
            return res.status(200).json(product);
        }catch(server_error: any){
            return res.status(4000).json({message: server_error.message});
        }
    }
}

export default new ProductController();