import express, {NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import config from './config/config';
import logger from './config/logger';
import path from 'path';
import api from './router/api';
import pages from './router/pages';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/error.middleware';


const server = express();
const NAMESPACE = 'SERVER';
const logging = new logger(NAMESPACE);

server.use(express.json());
server.use(cookieParser())
server.use(express.urlencoded({extended: false}));
server.use(errorHandler);

server.set("view engine", "ejs");
server.set('views', path.join(config.clientPath, 'views', 'pages'));
server.use('/static', express.static(path.join(config.clientPath, 'public')));

server.use((req: Request, res: Response, next: NextFunction) => {
    logging.info(`METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging.info(`METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
    });
    next();
});

server.use('/', pages);
server.use('/api', api);

server.use((req: Request, res: Response) => {
    return res.render('404');
});

mongoose.connect(config.mongo.url, config.mongo.options)
    .then( () => {
        logging.info('DB Connected');
        server.listen(config.port, () => {
            logging.info(`Server is running on port: ${config.port}`);
        });
    })
    .catch( (err) => {
        logging.error(`DB NOT CONNECTED! Error: ${err.message}`)
    });