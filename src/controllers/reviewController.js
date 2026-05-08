import AppError from "../utils/appError.js";
import asyncHandler from 'express-async-handler';
import ReviewModel from "../models/review.js";
import ProductModel from "../models/product.js";
import QueryBuilder from "../utils/queryBuilder.js";

const createReview = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    const productExists = await ProductModel.findById(id);
    if(!productExists) {
        return next(new AppError('Product not found', 404));
    }
    const alreadyReview = await ReviewModel.findById(id);
    if(alreadyReview) {
        return next(new AppError('You already review this product', 404));
    }
    const reviwProduct = new ReviewModel({
        product: id,
        ...req.body
    });
    await reviwProduct.save();

    res.status(201).json({
        status: 'success',
        data: {review: reviwProduct}
    })
});

const getProductReviews = asyncHandler (async(req, res, next) => {
    const {id} = req.params;
    const productExists = await ProductModel.findById(id);
    if(!productExists) {
        return next(new AppError('Product not found', 404));
    };
    const reviews = await new QueryBuilder(ReviewModel, req.query, {product: id})
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate()
    .execute();

    res.status(200).json({
        status: 'success',
        pagination: reviews.pagination,
        result: reviews.data.length,
        data: reviews.data
    });
});

const getSingleReview = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    const review = await ReviewModel.findById(id);
    if(!review) {
        return next(new AppError('Review not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {review}
    })
   
})

const updateReviews = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    const review = await ReviewModel.findByIdAndUpdate(
        id,
        req.body,
        {new: true, runValidators: true}
    );
    if(!review) {
        return next(new AppError('Product not found', 404));
    };
    res.status(200).json({
        status: 'success',
        data: {review}
    });
});

const deleteReview = asyncHandler (async(req, res, next) => {
    const { id } = req.params;
    const review = await ReviewModel.findByIdAndDelete(id);
    if(!review) {
        return next(new AppError('Review not found', 404));
    }
    res.status(200).json({
        status: 'success',
        message: 'Review delete successfully'
    })
})
 
export {
    createReview, getProductReviews,
    getSingleReview, updateReviews,
    deleteReview
}