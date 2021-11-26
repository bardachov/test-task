import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    return err instanceof SyntaxError && 'body' in err  ?  res.status(400).json({message: 'Invalid JSON'}) : res.status(500).json({message: 'Something went wrong'});
}
export default errorHandler; 