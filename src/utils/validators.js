import AppError from "./appError.js";
const validateNumber = (value, fieldName) => {
    const num = Number(value);
    if(isNaN(num)) {
        throw new AppError(`${fieldName} must be a valid number`, 400);
    }
    return num;
}

const validateRating = (value) => {
    const rating = validateNumber(value, 'minRating');
    if(rating < 0 || rating > 5) {
        throw new AppError('minRating must be between 0 and 5')
    }
    return rating;
}

export {validateNumber, validateRating};