import { Router } from 'express';
import * as OrderController from '../controllers/orderController.js';
import authentication from '../middleware/authentication.js';
import authorize from '../middleware/authorization.js';
import { writeLimiter } from '../middleware/rateLimiterMiddleware.js';
import { idParamValidation, orderCreateValidation, orderStatusValidation } from '../middleware/validationMiddleware.js';

const router = Router();

// Customers see their own orders, Admins see all (handled in the controller)
router.get('/', authentication, authorize('Customer', 'Admin'), OrderController.getOrders);
router.get('/:id', authentication, authorize('Customer', 'Admin'), idParamValidation, OrderController.getOrderById);

// Placing orders
router.post('/', authentication, authorize('Customer', 'Admin'), writeLimiter, orderCreateValidation, OrderController.createOrder);

// Admin only: confirm, mark ready for pickup, picked up, or cancel
router.put('/:id', authentication, authorize('Admin'), idParamValidation, orderStatusValidation, OrderController.updateOrderStatus);
router.patch('/:id', authentication, authorize('Admin'), idParamValidation, orderStatusValidation, OrderController.updateOrderStatus);
router.delete('/:id', authentication, authorize('Admin'), idParamValidation, OrderController.deleteOrder);

export default router;
