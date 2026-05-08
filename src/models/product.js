import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [3, 'Product name must be at least 3 characture'],
        maxlength: [200, 'Product name must be at most 200 characture'],
        index: true
    },
    description: {
        type: String,
        required: [true, 'description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 charactures']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Product price cannot negative'],
        index: true
    },
    comparePrice: {
        type: Number,
        min: [0, 'Original price cannot negative'],
        validate: {
            validator: function(val) {
                return val > this.price;
            },
            message: 'comparePrice must be greater than price'
        }
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        lowercase: true,
        trim: true,
        index: true
    },
    subcategory: {
        type: String,
        lowercase: true
    },
    brand: {
        type: String,
        index: true,
        trim: true
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        uppercase: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Stock cannot negative']
    },
    images: {
        type: [{
            url: {
                type: String,
                required: true,
                validate: {
                    validator: function (url) {
                        return /^https?:\/\/.+\..+/.test(url);
                    },
                    message: 'Image must vaild Url'
                }
            },
            alt: {
                type: String,
                trim: true,
                default: ""
            },
            isPrimay: {
                type: Boolean,
                default: false
            }
        }],
        validate: {
            validator: function(img) {
                return img.length > 0
            },
            message: 'Product must be at least one image'
        }
    },
    specifications: {
        type: Map,
        of: String,
        default: {}
    },
    tags: {
        type: [String],
        lowercase: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'out_of_stock', 'discontinued'],
        default: 'active',
        index: true
    },
    featured: {
        type: Boolean,
        default: false,
        index: true
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: [0, "Rating cannot be less than 0"],
            max: [5, "Rating cannot be more than 5"],
        },
        count: {
            type: Number,
            default: 0,
            min: [0, "Rating count cannot be negative"],
        }
    },
    reviewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    id: false,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

productSchema.index({category: 1, price: 1});
productSchema.index({status: 1, featured: -1});
productSchema.index({brand: 1, category: 1});
productSchema.index({'rating.average': -1});
productSchema.index({ createdAt: -1 });

productSchema.index({name: 'text', description: 'text'});

productSchema.virtual('onSale').get(function() {
    return this.comparePrice && this.comparePrice > this.price;
});

productSchema.virtual('discount').get(function() {
    if(!this.comparePrice || this.comparePrice <= this.price) return 0;
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
});

productSchema.virtual('review', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product'
});

const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;