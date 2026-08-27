import Product from '../models/Product.js';
import asyncHandler from '../middleware/asyncHandler.js';
import AppError from '../utils/AppError.js';
import ApiFeatures from '../utils/ApiFeatures.js';

export const getProducts = asyncHandler(async (req, res) => {
    const resultsPerPage = 12;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().sort();
    const filteredCount = await apiFeatures.query.clone().countDocuments();

    apiFeatures.pagination(resultsPerPage);
    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        products,
        productsCount,
        filteredCount,
        resultsPerPage,
    });
});

export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Product.distinct('category');
    res.status(200).json({ success: true, categories });
});

export const getDeals = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 12;
    const deals = await Product.aggregate([
        { $match: { cutPrice: { $gt: 0 } } },
        {
            $addFields: {
                discountPercent: {
                    $round: [{ $multiply: [{ $divide: [{ $subtract: ['$cutPrice', '$price'] }, '$cutPrice'] }, 100] }, 0],
                },
            },
        },
        { $sort: { discountPercent: -1 } },
        { $limit: limit },
    ]);
    res.status(200).json({ success: true, deals });
});

export const getNewArrivals = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 12;
    const products = await Product.find().sort({ createdAt: -1 }).limit(limit);
    res.status(200).json({ success: true, products });
});

export const getSingleProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    res.status(200).json({ success: true, product });
});

// --- Admin ---

export const getAdminProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});

export const createProduct = asyncHandler(async (req, res) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product deleted' });
});

// --- Reviews ---

export const createReview = asyncHandler(async (req, res) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };
    const product = await Product.findById(productId);
    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());

    if (alreadyReviewed) {
        product.reviews.forEach((r) => {
            if (r.user.toString() === req.user._id.toString()) {
                r.rating = review.rating;
                r.comment = review.comment;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({ success: true });
});
