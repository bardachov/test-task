import { Types } from "mongoose";
export default interface User{
    _id: Types.ObjectId,
    email: string,
    password: string,
    permission: number,
    products: Array<Types.ObjectId>
}

export enum Permissions{
    OWNER = 0x00000010,
    ADMIN = 0x00000008,
    USER = 0x000000001
}