import express from 'express';
import { getRazorpayKey, createPaymentOrder, verifyPayment } from '../controllers/paymentController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/payment/key', isAuthenticated, getRazorpayKey);
router.post('/payment/create', isAuthenticated, createPaymentOrder);
router.post('/payment/verify', isAuthenticated, verifyPayment);

export default router;
