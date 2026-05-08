import AppError from "./appError.js";
const handleCastError = (err) => {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

const handleDuplicateError = (err) => {
    const fields = Object.keys(err.keyValue)[0];
    const messages = {
        sku: 'SKU already exists'
    };
    const message = messages[fields] || `${fields} already exists`;
    return new AppError(message, 400)
};

export {handleCastError, handleDuplicateError};