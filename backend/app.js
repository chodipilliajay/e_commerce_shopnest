import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userAdminRoutes from './routes/userAdminRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.get('/api/v1/health', (req, res) => res.status(200).json({ success: true, message: 'ShopNest API is running' }));

app.use('/api/v1', authRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', paymentRoutes);
app.use('/api/v1', userAdminRoutes);

app.use(errorHandler);

export default app;
