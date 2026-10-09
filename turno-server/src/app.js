import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import logRoutes from './routes/logRoutes.js';
import { auditLoggerMiddleware } from './middleware/auditLoggerMiddleware.js';
import { apiLimiter } from './middleware/rateLimiterMiddleware.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandlerMiddleware.js';
import { HttpStatus } from './config/constants.js';

const app = express();
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5000',
  // Extra origins (e.g. a deployed client) can be added as a comma-separated CLIENT_URL
  ...(process.env.CLIENT_URL || '').split(',').map((url) => url.trim()).filter(Boolean),
]);

const corsOptions = {
  origin(origin, callback) {
    // Unknown origins get no CORS headers (the browser blocks them) instead of a 500 error
    return callback(null, !origin || allowedOrigins.has(origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'],
};

/* ── Middleware, in order: security headers → CORS → body parsing → audit log → rate limit ── */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", 'data:'],
      fontSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  frameguard: { action: 'sameorigin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(auditLoggerMiddleware);
app.use('/api', apiLimiter);

/* ── Routes ── */
app.get('/api/health', (_req, res) => {
  res.status(HttpStatus.OK).json({
    success: true,
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Each resource is available at /api/<name> and as version 1 at /api/v1/<name>
const resources = {
  auth: authRoutes,
  user: userRoutes,
  product: productRoutes,
  products: productRoutes,
  category: categoryRoutes,
  supplier: supplierRoutes,
  cart: cartRoutes,
  order: orderRoutes,
  review: reviewRoutes,
  log: logRoutes,
};
for (const [name, router] of Object.entries(resources)) {
  app.use(`/api/${name}`, router);
  app.use(`/api/v1/${name}`, router);
}

/* ── Centralized error handling (must come last) ── */
app.use('/api', notFoundHandler);
app.use(errorHandler);

export default app;
