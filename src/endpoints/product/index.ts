import {Request, Response, Router } from "express";
import ProductModel from '../../models/product.model';
const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try{
        const products = (await ProductModel.find({})).map(product => {
            const {id, name, description, price, image} = product;
            return {
                id, name, description, price, image
            }
        });
        return res.status(200).json(products);
    }catch(server_error){
        return res.status(500).json({message: 'Something went wrong'});
    }
});

//Использоался для разработки.
//Слабая валидация без проверок на минимальную корректность.
/*
router.post('/', async (req: Request, res: Response) =>{
    const id = await ProductModel.count({}) + 1;
    try{
        try{
            const options:Product = {
                id,
                name: req.body.name.toString(),
                description: req.body.description.toString(),
                price: Number(req.body.price),
                image: req.body.image.toString()
            };
            await ProductModel.create(options);
            return res.status(200).json({message: 'Created'});
        }catch(err){
            return res.status(400).json({message: 'Invalid data'});
        }
    }catch(server_error){
        return res.status(500).json({message: 'Something went wrong'});
    }
})
*/

export default router;