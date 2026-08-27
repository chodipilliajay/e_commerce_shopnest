import crypto from 'crypto';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { sendToken } from '../utils/sendToken.js';
import { sendEmail } from '../utils/sendEmail.js';

export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new AppError('Please provide name, email and password', 400));
    }
    const user = await User.create({ name, email, password });
    sendToken(user, 201, res);
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please enter email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new AppError('Invalid email or password', 401));
    }
    const isValid = await user.verifyPassword(password);
    if (!isValid) {
        return next(new AppError('Invalid email or password', 401));
    }
    sendToken(user, 200, res);
});

export const logout = asyncHandler(async (req, res) => {
    res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, email },
        { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, user });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const isMatch = await user.verifyPassword(oldPassword);
    if (!isMatch) {
        return next(new AppError('Old password is incorrect', 400));
    }
    if (newPassword !== confirmPassword) {
        return next(new AppError("New passwords don't match", 400));
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('No account found with that email', 404));
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `You requested a password reset.\n\nClick this link to set a new password (valid for 30 minutes):\n${resetUrl}\n\nIf you didn't request this, please ignore this email.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopNest - Password Reset Request',
            message,
        });
        res.status(200).json({ success: true, message: `Reset link sent to ${user.email}` });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Email could not be sent. Please try again later.', 500));
    }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError('Reset link is invalid or has expired', 400));
    }
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return next(new AppError("Passwords don't match", 400));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
});
