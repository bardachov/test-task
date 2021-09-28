import mongoose, { Schema } from 'mongoose';
import { Product } from '../types/product';

const ProductModel: Schema = new Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true}
}, {timestamps: true});

export default mongoose.model<Product>('Product', ProductModel);