import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, 'config/config.env') });

import mongoose from 'mongoose';
import app from './app.js';

if (!process.env.DB_URI) {
    console.log('DB_URI is not set. Check that backend/config/config.env exists and has a valid DB_URI value.');
    process.exit(1);
}

process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});

mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => {
        console.log(`MongoDB connection failed: ${err.message}`);
    });

const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`ShopNest server running on port ${process.env.PORT || 8000}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
