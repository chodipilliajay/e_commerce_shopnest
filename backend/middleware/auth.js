import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import AppError from '../utils/AppError.js';
import User from '../models/User.js';

export const isAuthenticated = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new AppError('Please login to access this resource', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
        return next(new AppError('User no longer exists', 401));
    }
    next();
});

export const authorizeRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new AppError(`Role '${req.user.role}' is not allowed to access this resource`, 403));
    }
    next();
};
