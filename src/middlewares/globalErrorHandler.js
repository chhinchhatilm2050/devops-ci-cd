import { handleCastError, handleDuplicateError } from "../utils/errorHandler.js";

const globalErrorHandler = (err, req, res) => { 
    const isDev = process.env.NODE_ENV === 'development';
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = {...err, message: err.message};
    if(err.name === 'CastError') error = handleCastError(err);
    if(err.code === 11000) error = handleDuplicateError(err);
    if(isDev) console.log(`Stack: ${err.stack}`);
    
    if(isDev) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
            stack: err.stack
        })
    } else {
        if(error.isOperational) {
            res.status(error.statusCode).json({
                status: error.status,
                message: error.message,
            })
        } else {
            res.status(error.statusCode).json({
                status: error.status,
                message: 'something went wrong'
            })
        }
    }
}

export default globalErrorHandler;