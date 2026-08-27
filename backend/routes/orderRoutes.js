import express from 'express';
import {
    createOrder, getMyOrders, getSingleOrder, getAllOrders, updateOrderStatus, deleteOrder,
} from '../controllers/orderController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/order/new', isAuthenticated, createOrder);
router.get('/orders/me', isAuthenticated, getMyOrders);
router.get('/order/:id', isAuthenticated, getSingleOrder);

router.get('/admin/orders', isAuthenticated, authorizeRoles('admin'), getAllOrders);
router
    .route('/admin/order/:id')
    .put(isAuthenticated, authorizeRoles('admin'), updateOrderStatus)
    .delete(isAuthenticated, authorizeRoles('admin'), deleteOrder);

export default router;
