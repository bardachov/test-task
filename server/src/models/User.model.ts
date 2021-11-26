import {Schema, model as Model} from 'mongoose';
import user, {Permissions} from './types/user';

const UserModel = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    permission: {type: Number, required: true, default: Permissions.USER},
    products: [{type: 'ObjectId', ref: 'Product'}]
});

export default Model<user>('User', UserModel);