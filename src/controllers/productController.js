import asyncHandler from "express-async-handler";
import AppError from "../utils/appError.js";
import ProductModel from "../models/product.js";
import QueryBuilder from "../utils/queryBuilder.js";

const createProduct = asyncHandler( async(req, res) => {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).json({
        status: 'success',
        data: {product}
    })
});

const getProductWithAllQuery = asyncHandler (async(req, res) => {
    const products = await new QueryBuilder(ProductModel, req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate()
    .execute();
    
    res.status(200).json({
        status: 'success',
        pagination: products.pagination,
        data: {product: products.data}
    })

})

const getProductWithCursor = asyncHandler(async(req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const cursor = req.query.cursor;
    const query = {status: 'active'};
    if(cursor) {
        query.createdAt = {$lt: new Date(cursor)}
    }
    const products = await ProductModel.find(query)
    .sort({createdAt: -1})
    .limit(limit + 1)
    .lean();

    const hasNextPage = products.length > limit;
    if(hasNextPage) {
        products.pop();
    }
    const nextCursor = hasNextPage ? products[products.length - 1].createdAt.toISOString() : null;
    res.status(200).json({
        pagination: {
            nextCursor,
            hasNextPage,
            limit
        },
        success: true,
        data: products,
    });
});

const getProductByFeatured = asyncHandler (async(req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const product = await ProductModel.find({
        featured: true,
        status: 'active'
    }).sort({'rating.average': -1}).limit(limit).lean();
    res.status(200).json({
        status: 'success',
        count: product.length,
        data: { product }
    })
});

const getProductOnsale = asyncHandler (async(req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    let products = await ProductModel.find({
        status: 'active',
        $expr: {$gt: ['$comparePrice', '$price']}
    })
    .sort({createdAt: -1})
    .limit(limit);
    if(req.query.sort === '-discount') {
        products = products.sort((a,b) => b.discount - a.discount);
    }
    res.status(200).json({
        status: 'success',
        count: products.length,
        data: { products }
    });
});

const getProductBySearch = asyncHandler(async (req, res, next) => {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
        return next(new AppError('Search query is required', 400));
    }
    if (q.trim().length > 100) {
        return next(new AppError('Search query must be less than 100 characters', 400));
    }
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const products = await ProductModel.find({
        $text: { $search: q.trim() }
    }).sort({ createdAt: -1 }).limit(limit);

    if (!products.length) {
        return next(new AppError('No products found', 404));
    }

    res.status(200).json({
        status: 'success',
        count: products.length,
        data: { products }
    });
});

const getSingleProduct = asyncHandler (async(req, res, next) => {
    const product = await ProductModel.findById(req.params.id)
    .populate('review', 'customerName customerEmail title comment');
    if(!product) {
        return next(new AppError('Product not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {product}
    })
});

const updateProduct = asyncHandler (async(req, res, next) => {
    const { price, comparePrice } = req.body;
    if(price && comparePrice && comparePrice <= price) {
        return next(new AppError('comparePrice must be greater than price', 400));
    }
    const product = await ProductModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: false }
    );
    if(!product) {
        return next(new AppError('Product not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {product}
    })
});

const deleteProduct = asyncHandler(async(req, res, next) => {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if(!product) {
        return next(new AppError('Product not found', 404));
    }
    res.status(200).json({
        status: 'success',
        message: 'Delete successfully'
    })
})

export {
    createProduct, getProductWithAllQuery, getProductWithCursor,
    getProductByFeatured, getProductOnsale, getProductBySearch,
    getSingleProduct, updateProduct, deleteProduct
};