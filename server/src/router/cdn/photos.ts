import {Router} from 'express';
import ProductModel from '../../models/Product.model';

const PhotoCDN = Router();

PhotoCDN.get('/:filename', async (req, res) => {
    try{
        const product = await ProductModel.findOne({'image.filename': req.params.filename});
        if (!product) return res.status(404).json({message: 'image not found'});
        const base64data = product.image.base64encode.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const img = Buffer.from(base64data, 'base64');
        res.writeHead(200, {'Content-Type': 'image/png','Content-Length': img.length});
        return res.end(img); 
    }catch(server_error){
        return res.status(500).json({message: 'Something went wrong...'})
    }
})

export default PhotoCDN;