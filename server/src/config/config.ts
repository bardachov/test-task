import fs from 'fs';
import path from 'path';
import {ConnectOptions} from 'mongoose';
import { config } from '../types/config.types';

const NODE_TYPES = {
    development: "development",
    production: "production"
}
const NODE_ENV = process.env.NODE_ENV || NODE_TYPES.development;
const NODE = {
    types: NODE_TYPES,
    env: NODE_ENV
}

const ParsedConfig: config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..' ,'config.json')).toString())
const LOCAL_CONFIG = NODE_ENV == NODE_TYPES.development ? ParsedConfig.development : ParsedConfig.production;
const ClientPATH = path.resolve(__dirname, '..', '..', '..', 'client');

const DEFAULT_PORT = 5000;
const PORT: number = Number(process.env.PORT) || DEFAULT_PORT ;

const MONGODB_URL = LOCAL_CONFIG.mongodb;
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

const CDN_PATH = '/cdn';
const CDN_PHOTOS = `${CDN_PATH}/photos`;
const CDN = {
    root: CDN_PATH,
    photos: CDN_PHOTOS
}

const config = {
    node: NODE,
    mongo: MONGO,
    port: PORT,
    secure: LOCAL_CONFIG.secure,
    clientPath: ClientPATH,
    cdn: CDN
};

export default config;