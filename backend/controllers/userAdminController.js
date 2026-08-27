import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';
import AppError from '../utils/AppError.js';

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json({ success: true, users });
});

export const getSingleUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({ success: true, user });
});

export const updateUserRole = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role: req.body.role },
        { new: true, runValidators: true }
    );
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({ success: true, user });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted' });
});
