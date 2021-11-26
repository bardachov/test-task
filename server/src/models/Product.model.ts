import {Schema, model as Model} from 'mongoose';
import Product from './types/product';

const ProductModel = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    description: {type: String}
});

export default Model<Product>('Product', ProductModel);