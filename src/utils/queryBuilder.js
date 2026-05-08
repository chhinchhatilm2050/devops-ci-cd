import AppError from "./appError.js";
import { validateNumber, validateRating } from "./validators.js";

class QueryBuilder {
    constructor(model, queryString, baseFilter = {}) {
        this.model = model;
        this.queryString = queryString;
        this.query = model.find(baseFilter);
        this.filterQuery = {...baseFilter};
        this.page = 1;
        this.limit = 20
    }

    filter() {
        const queryObj = {...this.queryString};
        const excludeFields = ['page', 'limit', 'sort', 'fields', 'search', 'cursor'];
        excludeFields.forEach(field => delete queryObj[field]);

        if(queryObj.inStock !== undefined) {
            if(queryObj.inStock === 'true') {
                queryObj.stock = {$gt: 0}
            }
            delete queryObj.inStock;
        }

        if(queryObj.category !== undefined) {
            const rawData = String(this.queryString.category).toLowerCase().trim();
            if(!/^[-\w,]+$/.test(rawData)) {
                throw new AppError('Invalid category parameter', 400);
            }
            queryObj.category = rawData;
        }

        if(queryObj.onSale !== undefined) {
            if(queryObj.onSale === 'true') {
                queryObj.$expr = { $gt: ['$comparePrice', '$price']};
            }
            delete queryObj.onSale;
        }

        if(queryObj.minPrice || queryObj.maxPrice) {
            const priceQuery = {};
            if(queryObj.minPrice) {
                priceQuery.$gte = validateNumber(queryObj.minPrice, 'minPrice');
            }
            if(queryObj.maxPrice) {
                priceQuery.$lte = validateNumber(queryObj.maxPrice, 'maxPrice')
            }
            if(
                priceQuery.$gte !== undefined &&
                priceQuery.$lte !== undefined &&
                priceQuery.$gte > priceQuery.$lte
            ) {
                throw new AppError('minPrice cannot be greater than maxPrice', 400);
            }
            queryObj.price = priceQuery;
            delete queryObj.minPrice;
            delete queryObj.maxPrice;
        }

        if(queryObj.minRating !== undefined) {
            queryObj['rating.average'] = { $gte: validateRating(queryObj.minRating) };
            delete queryObj.minRating;
        }

        if(queryObj.tags) {
            queryObj.tags = {
               $in: queryObj.tags.split(',')
               .map(t =>t.trim()
               .toLowerCase())
               .filter(Boolean)
            };
        }
        if(queryObj.featured !== undefined) {
            queryObj.featured = queryObj.featured === 'true';
        }
        this.filterQuery = queryObj;
        this.query = this.query.find(queryObj);
        return this;
    }
    search() {
        if(this.queryString.search) {
            const searchTerm = String(this.queryString.search).trim();
            if(searchTerm.length < 1) return this;
            if(searchTerm.length > 100) {
                throw new AppError('Serch term must be less than 100 characters', 400);
            }
            this.query = this.query.find({
                $text: {$search: searchTerm}
            })
        }
        return this;
    }

    sort() {
        if(this.queryString.sort) {
            const rawData = String(this.queryString.sort);
            if(!/^[-\w,]+$/.test(rawData)) {
                throw new AppError('Invalid sort parameter', 400);
            }
            const sortBy = rawData.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if(this.queryString.fields) {
            const rawData = String(this.queryString.fields);
            if (!/^[-\w,]+$/.test(rawData)) {
                throw new AppError('Invalid fields parameter', 400);
            }
            const fields = rawData.split(',').join('');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = Math.max(1, parseInt(this.queryString.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(this.queryString.limit) || 20 ));
        const skip = (page - 1) * limit;
        this.page = page;
        this.limit = limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
    async execute() {
        const [data, total] = await Promise.all([this.query, this.model.countDocuments(this.filterQuery)]);
        const totalPage = Math.ceil(total / this.limit);

        return {
            data,
            pagination: {
                total,
                page: this.page,
                limit: this.limit,
                totalPage,
                hasNextPage: this.page < totalPage,
                hasPrevPage: this.page > 1
            }
        }
    }
}

export default QueryBuilder;
