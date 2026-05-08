import asyncHandler from 'express-async-handler';
import ProductModel from '../models/product.js';

const getSummaryProduct = asyncHandler(async(req, res) => {
    const [totalproducts, categories, avgStats] = await Promise.all([
        ProductModel.countDocuments({ status: 'active' }),
        ProductModel.distinct('category'),
        ProductModel.aggregate([
            {$match: { status: 'active'}},
            {
                $group: {
                    _id: null,
                    avgPrice: {$avg: '$price'},
                    avgRating: {$avg: '$rating.average'},
                    totalStock: {$sum: '$stock'}
                }
            }
        ])
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            totalproducts,
            totalCategories: categories.length,
            avgPrice: avgStats[0]?.avgPrice.toFixed(2) || 0,
            avgRating: avgStats[0]?.avgRating.toFixed(2) || 0,
            totalStock: avgStats[0]?.totalStock || 0
        }
    })
});

const getProductPerCagetory = asyncHandler(async(req, res) => {
    const stats = await ProductModel.aggregate([
        {$match: { status: 'active'}},
        {
            $group: {
                _id: '$category',
                count: {$sum: 1},
                avgPrice: {$avg: '$price'},
                totalStock: {$sum: '$stock'}
            }
        },
        { $sort: {count: -1}}
    ]);
    res.status(200).json({
        status: 'succes',
        data: stats.map(s => ({
            category: s._id,
            productCount: s.count,
            avgPrice: s.avgPrice.toFixed(2),
            totalStock: s.totalStock
        }))
    })
});

const getProductTopRated = asyncHandler( async(req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const products = await ProductModel.find({
        status: 'active',
        'rating.count': { $gte: 5}
    })
    .sort({'rating.average': -1}, {'rating.count': -1})
    .limit(limit)
    .select('name price rating category brand images')
    .lean();

    res.status(200).json({
      status: 'success',
      count: products.length,
      data: products
    });
})

export { getSummaryProduct, getProductPerCagetory, getProductTopRated }