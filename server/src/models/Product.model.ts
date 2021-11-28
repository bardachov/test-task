import {Schema, model as Model} from 'mongoose';
import Product from './types/product';

const ProductModel = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    image: {
        filename: {type: String, required: true, unique: true},
        path: {type: String},
        base64encode: {type: String}
    },
    description: {type: String}
});

export default Model<Product>('Product', ProductModel);