import { Router } from 'express';
import Cart from '../models/Cart.js';
import { HttpStatus } from '../config/constants.js';

const router = Router();

// GET /api/cart/:userId
router.get('/:userId', async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'title price imageUrl');
    if (!cart) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Cart not found' });
    res.status(HttpStatus.OK).json(cart);
  } catch (error) {
    next(error);
  }
});

// POST /api/cart
router.post('/', async (req, res, next) => {
  try {
    const { user, items, total } = req.body;
    const cart = await Cart.create({ user, items, total });
    res.status(HttpStatus.CREATED).json(cart);
  } catch (error) {
    next(error);
  }
});

// PUT /api/cart/:userId
router.put('/:userId', async (req, res, next) => {
  try {
    const { items, total } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { user: req.params.userId },
      { items, total },
      { new: true, runValidators: true, upsert: true }
    );
    res.status(HttpStatus.OK).json(cart);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart/:userId
router.delete('/:userId', async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndDelete({ user: req.params.userId });
    if (!cart) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Cart not found' });
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
});

export default router;
