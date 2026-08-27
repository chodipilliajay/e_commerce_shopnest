import express from 'express';
import {
    register, login, logout, getMe, updateProfile, updatePassword, forgotPassword, resetPassword,
} from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);

router.get('/me', isAuthenticated, getMe);
router.put('/me/update', isAuthenticated, updateProfile);
router.put('/password/update', isAuthenticated, updatePassword);

export default router;
