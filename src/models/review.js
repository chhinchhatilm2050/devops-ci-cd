import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product is required'],
        index: true
    },
    customerName: {
        type: String,
        trim: true,
        required: [true, "Customer name is required!"]
    },
    customerEmail: {
        type: String,
        required: [true, "Customer email is required"],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email);
            },
            message: "Please provide a valid email address"
        },
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot be more than 5"],
    },
    title: {
      type: String,
      trim: true,
      minlength: [5,   "Title must be at least 5 characters"],
      maxlength: [100, "Title must be at most 100 characters"],
    },
    comment: {
      type: String,
      trim: true,
      minlength: [10,   "Comment must be at least 10 characters"],
      maxlength: [1000, "Comment must be at most 1000 characters"],
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: [0, "Helpful count cannot be negative"],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    images: {
        type: [{
            url: {
                type: String,
                required: true,
                validate: {
                    validator: function(url) {
                        return /^https?:\/\/.+\..+/.test(url);
                    },
                    message: 'Image must be valid URL'
                }
            },
            alt: {
                type: String,
                trim: true,
                default: ""
            }
        }],
        validate: {
            validator: function(img) {
                return img.length > 0;
            },
            message: 'Review image must be at least 1 image'
        }
    }
}, {
    timestamps: true,
    id: false,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});


const ReviewModel = mongoose.model('Review', reviewSchema);
export default ReviewModel;
