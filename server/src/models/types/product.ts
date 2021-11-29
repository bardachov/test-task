import { Types } from "mongoose";
export default interface Product {
    _id: Types.ObjectId,
    name: string,
    description: string,
    price: number,
    image: {
        filename: string,
        path: string,
        base64encode: string
    },
};