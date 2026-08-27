import AppError from '../utils/AppError.js';

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    if (err.name === 'CastError') {
        err = new AppError(`Resource not found. Invalid: ${err.path}`, 404);
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        err = new AppError(`${field} already registered. Please login instead.`, 400);
    }

    if (err.name === 'JsonWebTokenError') {
        err = new AppError('Invalid authentication token. Please login again.', 401);
    }

    if (err.name === 'TokenExpiredError') {
        err = new AppError('Your session has expired. Please login again.', 401);
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message).join(', ');
        err = new AppError(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
