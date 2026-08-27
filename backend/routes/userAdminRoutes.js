import express from 'express';
import { getAllUsers, getSingleUser, updateUserRole, deleteUser } from '../controllers/userAdminController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin/users', isAuthenticated, authorizeRoles('admin'), getAllUsers);
router
    .route('/admin/user/:id')
    .get(isAuthenticated, authorizeRoles('admin'), getSingleUser)
    .put(isAuthenticated, authorizeRoles('admin'), updateUserRole)
    .delete(isAuthenticated, authorizeRoles('admin'), deleteUser);

export default router;
