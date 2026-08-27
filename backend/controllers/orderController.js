import Order from '../models/Order.js';
import Product from '../models/Product.js';
import asyncHandler from '../middleware/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { sendEmail } from '../utils/sendEmail.js';

export const createOrder = asyncHandler(async (req, res) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    // Reduce stock for each purchased item
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
            await product.save({ validateBeforeSave: false });
        }
    }

    try {
        const itemLines = orderItems.map((i) => `- ${i.name}  x${i.quantity}  ₹${i.price} each`).join('\n');
        await sendEmail({
            email: req.user.email,
            subject: `ShopNest - Order Confirmed #${order._id}`,
            message: `Hi ${req.user.name},\n\nThanks for your order!\n\nOrder ID: ${order._id}\n\nItems:\n${itemLines}\n\nSubtotal: ₹${itemsPrice}\nShipping: ₹${shippingPrice}\nTax: ₹${taxPrice}\nTotal: ₹${totalPrice}\n\nShipping to:\n${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country} - ${shippingInfo.pinCode}\n\nTrack your order anytime from "My Orders".\n\nThanks for shopping with ShopNest!`,
        });
    } catch (err) {
        console.log(`Order confirmation email failed: ${err.message}`);
    }

    res.status(201).json({ success: true, order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
});

export const getSingleOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
        return next(new AppError('Order not found', 404));
    }
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new AppError('Not authorized to view this order', 403));
    }
    res.status(200).json({ success: true, order });
});

// --- Admin ---

export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    const totalAmount = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    res.status(200).json({ success: true, orders, totalAmount });
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
        return next(new AppError('Order not found', 404));
    }
    if (order.orderStatus === 'Delivered') {
        return next(new AppError('This order is already delivered', 400));
    }
    order.orderStatus = req.body.status;
    if (order.orderStatus === 'Delivered') {
        order.deliveredAt = Date.now();
    }
    await order.save();

    try {
        await sendEmail({
            email: order.user.email,
            subject: `ShopNest - Order #${order._id} is now "${order.orderStatus}"`,
            message: `Hi ${order.user.name},\n\nYour order #${order._id} status has been updated to: ${order.orderStatus}.\n\nTrack full details anytime from "My Orders".\n\nThanks for shopping with ShopNest!`,
        });
    } catch (err) {
        console.log(`Order status email failed: ${err.message}`);
    }

    res.status(200).json({ success: true, order });
});

export const deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new AppError('Order not found', 404));
    }
    await order.deleteOne();
    res.status(200).json({ success: true, message: 'Order deleted' });
});
