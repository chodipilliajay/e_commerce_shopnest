import express from 'express';
import {
    getProducts, getCategories, getDeals, getNewArrivals, getSingleProduct,
    getAdminProducts, createProduct, updateProduct, deleteProduct, createReview,
} from '../controllers/productController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/categories', getCategories);
router.get('/products/deals', getDeals);
router.get('/products/new-arrivals', getNewArrivals);
router.get('/product/:id', getSingleProduct);
router.put('/review', isAuthenticated, createReview);

router.get('/admin/products', isAuthenticated, authorizeRoles('admin'), getAdminProducts);
router.post('/admin/product/new', isAuthenticated, authorizeRoles('admin'), createProduct);
router
    .route('/admin/product/:id')
    .put(isAuthenticated, authorizeRoles('admin'), updateProduct)
    .delete(isAuthenticated, authorizeRoles('admin'), deleteProduct);

export default router;
