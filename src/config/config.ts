import {ConnectOptions} from 'mongoose';

const NODE_ENV = process.env.NODE_ENV;
const SERVER_PORT: number = Number(process.env.PORT) || 3000 ;
const SERVER = {
    port: SERVER_PORT
};

const MONGODB_URL = process.env.MONGO_URI || 'mongodb+srv://db-admin:super-hard-password@db.8jygu.mongodb.net/db?retryWrites=true&w=majority';
const MONGO_OPTIONS: ConnectOptions = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: false,
};
const MONGO = {
    options: MONGO_OPTIONS,
    url: MONGODB_URL
};

const config = {
    node: NODE_ENV,
    mongo: MONGO,
    server: SERVER
};

export default config;