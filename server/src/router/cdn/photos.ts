import {Router} from 'express';
import ProductModel from '../../models/Product.model';

const PhotoCDN = Router();

PhotoCDN.get('/:filename', async (req, res) => {
    const product = await ProductModel.findOne({'image.filename': req.params.filename});
    if (!product) return res.status(404).json({message: 'image not found'});
    const base64data = product.image.base64encode.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const img = Buffer.from(base64data, 'base64');
    res.writeHead(200, {'Content-Type': 'image/png','Content-Length': img.length});
    return res.end(img); 
})

export default PhotoCDN;