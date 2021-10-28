import {Schema, model as Model} from 'mongoose';
import Product from './types/product';

const ProductsModel = new Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    price: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String}
})

export default Model<Product>('Products', ProductsModel);