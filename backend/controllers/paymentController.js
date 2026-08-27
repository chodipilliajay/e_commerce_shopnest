import Razorpay from 'razorpay';
import crypto from 'crypto';
import asyncHandler from '../middleware/asyncHandler.js';

const isPlaceholder = (val) => !val || val === 'your-razorpay-key-id' || val === 'your-razorpay-key-secret';

const isRazorpayConfigured = () =>
    !isPlaceholder(process.env.RAZORPAY_API_KEY) && !isPlaceholder(process.env.RAZORPAY_API_SECRET);

const getInstance = () =>
    new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET,
    });

// Tells the frontend whether to load the real Razorpay widget or the Demo Payment flow.
export const getRazorpayKey = asyncHandler(async (req, res) => {
    if (!isRazorpayConfigured()) {
        return res.status(200).json({ success: true, demo: true, key: null });
    }
    res.status(200).json({ success: true, demo: false, key: process.env.RAZORPAY_API_KEY });
});

export const createPaymentOrder = asyncHandler(async (req, res) => {
    const amount = Number(req.body.amount);
    const safeAmount = amount > 0 ? amount : 1;
    const amountInPaise = Math.round(safeAmount * 100);

    // No real Razorpay credentials configured at all - go straight to demo mode.
    if (!isRazorpayConfigured()) {
        return res.status(200).json({
            success: true,
            demo: true,
            order: { id: `demo_order_${Date.now()}`, amount: amountInPaise, currency: 'INR' },
        });
    }

    // Credentials are present but may be invalid/wrong - try the real gateway,
    // and fall back to demo mode instead of blocking checkout if they don't work.
    try {
        const instance = getInstance();
        const order = await instance.orders.create({ amount: amountInPaise, currency: 'INR' });
        res.status(200).json({ success: true, demo: false, order });
    } catch (err) {
        console.log(`Razorpay order creation failed (${err.error?.description || err.message}), falling back to demo mode.`);
        res.status(200).json({
            success: true,
            demo: true,
            order: { id: `demo_order_${Date.now()}`, amount: amountInPaise, currency: 'INR' },
        });
    }
});

export const verifyPayment = asyncHandler(async (req, res) => {
    const { demo, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (demo) {
        return res.status(200).json({
            success: true,
            demo: true,
            message: 'Demo payment simulated successfully',
            reference: razorpay_payment_id,
        });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
        .update(body)
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;
    res.status(200).json({
        success: isAuthentic,
        message: isAuthentic ? 'Payment verified successfully' : 'Payment verification failed',
        reference: razorpay_payment_id,
    });
});
