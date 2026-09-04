import { Router } from 'express';
import Order from '../models/Order.js';
import { HttpStatus } from '../config/constants.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// GET /api/order — admin sees all, customer sees own
router.get('/', authenticate, async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'customer') filter.user = req.user.id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.userId && req.user.role === 'admin') filter.user = req.query.userId;

    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'title price imageUrl')
      .sort({ createdAt: -1 });

    res.status(HttpStatus.OK).json({ data: orders });
  } catch (error) { next(error); }
});

// GET /api/order/:id — authenticated
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'title price imageUrl');
    if (!order) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Order not found' });
    // customers can only view their own orders
    if (req.user.role === 'customer' && order.user._id.toString() !== req.user.id) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Access denied.' });
    }
    res.status(HttpStatus.OK).json(order);
  } catch (error) { next(error); }
});

// POST /api/order — authenticated customers
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body;
    if (!items || items.length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Order must have at least one item.' });
    }
    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
    });
    res.status(HttpStatus.CREATED).json({ data: order });
  } catch (error) { next(error); }
});

// PUT /api/order/:id — admin only (update status)
router.put('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { status, paidAt, deliveredAt } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, paidAt, deliveredAt },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Order not found' });
    res.status(HttpStatus.OK).json({ data: order });
  } catch (error) { next(error); }
});

// DELETE /api/order/:id — admin only
router.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Order not found' });
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) { next(error); }
});

export default router;
