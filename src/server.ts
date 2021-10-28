import express, {NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import config from './config/config';
import logging from './config/logging';
import path from 'path';
import api from './router/api';
import pages from './router/pages';

const server = express();
const NAMESPACE = 'SERVER';

server.use(express.json());
server.use(express.urlencoded({extended: false}));

server.set("view engine", "ejs");
server.set('views', path.join(__dirname, 'client', 'views', 'pages'));
server.use('/static', express.static(path.join(__dirname,'client', 'public')));

server.use((req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
    });
    next();
});

server.use('/', pages);
server.use('/api', api);

server.use((req: Request, res: Response) => {
    const error = new Error('Not found');
    return res
            .status(404)
            .json({message: error.message});
});

mongoose.connect(config.mongo.url, config.mongo.options)
    .then( () => {
        logging.info(NAMESPACE, 'DB Connected');
        server.listen(config.server.port, () => {
            logging.info(NAMESPACE, `Server is running on port: ${config.server.port}`);
        });
    })
    .catch( (err) => {
        logging.error(NAMESPACE, `DB NOT CONNECTED! Error: ${err.message}`)
    });