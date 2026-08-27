import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [120, 'Product name cannot exceed 120 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [8, 'Price cannot exceed 8 digits'],
    },
    cutPrice: {
        // Original/MRP price - when higher than price, the difference is shown as a discount %
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        default: 1,
        maxLength: [5, 'Stock cannot exceed 5 digits'],
    },
    images: [
        {
            url: { type: String, required: true },
        },
    ],
    ratings: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

productSchema.index({ name: 'text', category: 'text' });

export default mongoose.model('Product', productSchema);
