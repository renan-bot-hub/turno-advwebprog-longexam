import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import cartRoutes from './routes/carts.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import userRoutes from './routes/users.js';
import v1ProductRoutes from './routes/v1/products.js';
import { HttpStatus } from './config/constants.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.status(HttpStatus.OK).json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// v1 routes (versioned)
app.use('/api/v1/product', v1ProductRoutes);

// Base routes
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/user', userRoutes);

// Global error handler
app.use((error, _req, res, _next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Validation failed', errors: error.errors });
  }
  if (error.code === 11000) {
    return res.status(HttpStatus.CONFLICT).json({ message: 'Duplicate entry already exists' });
  }
  if (error instanceof mongoose.Error.CastError) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid ID format' });
  }
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
});

export default app;
