import express, {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import config from './config/config';
import logging from './config/logging';
import path from 'path';
const app = express();
const NAMESPACE = 'SERVER';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname,'public')));

app.use((req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
    });
    next();
});

app.get('/', (req: Request, res: Response) => {
    res.render('pages/index');
});

app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Not found');
    return res
            .status(404)
            .json({message: error.message});
});

mongoose.connect(config.mongo.url, config.mongo.options)
    .then( () => {
        logging.info(NAMESPACE, 'DB Connected');
        app.listen(config.server.port, () => {
            logging.info(NAMESPACE, `Server is running on port:${config.server.port}`);
        });
    })
    .catch( err => {
        logging.error(NAMESPACE, `DB NOT CONNECTED! Error: ${err.message}`)
    });