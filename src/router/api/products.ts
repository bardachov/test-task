import {Request, Response, Router} from 'express';
import ProductsModel from '../../models/Products.model';
import Product from '../../models/types/product';

const router = Router();
router.get('/', async(req: Request, res: Response) => {
    try{
        const products = (await ProductsModel.find({})).map(product => {
            const {id, name, description, price, image} = product;
            return {id, name, description, price, image};
        });
        return res.status(200).json(products);
    }catch(server_error){
        return res.status(500).json({message: 'Something went wrong'});
    }
});

router.post('/', async(req: Request, res: Response) => {
    try{
        try{
            const id: number = (await ProductsModel.count({})) + 1;
            const product: Product = {
                id,
                name: req.body.name.toString(),
                description: req.body.description?.toString() || '',
                price: Number(req.body.price),
                image: req.body.image.toString()
            }
            await ProductsModel.create(product);
            return res.status(200).json({...product, status: true});
        }catch(model_error){
            res.status(404).json({message: 'Invalid Options', status: false});
        }
    }catch(server_error){
        return res.status(500).json({message: 'Something went wrong'});
    }
});

export default router;