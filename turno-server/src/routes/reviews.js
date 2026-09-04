import { Router } from 'express';
import Review from '../models/Review.js';
import { HttpStatus } from '../config/constants.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// GET /api/review — public
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.productId) filter.product = req.query.productId;
    if (req.query.userId) filter.user = req.query.userId;
    const reviews = await Review.find(filter)
      .populate('user', 'firstName lastName')
      .populate('product', 'title')
      .sort({ createdAt: -1 });
    res.status(HttpStatus.OK).json({ data: reviews });
  } catch (error) { next(error); }
});

// GET /api/review/:id — public
router.get('/:id', async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'firstName lastName')
      .populate('product', 'title');
    if (!review) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Review not found' });
    res.status(HttpStatus.OK).json(review);
  } catch (error) { next(error); }
});

// POST /api/review — authenticated customers
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { product, rating, comment } = req.body;
    if (!product || !rating) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Product and rating are required.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Rating must be between 1 and 5.' });
    }
    const review = await Review.create({ user: req.user.id, product, rating, comment });
    res.status(HttpStatus.CREATED).json({ data: review });
  } catch (error) { next(error); }
});

// PUT /api/review/:id — owner or admin
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Review not found' });
    if (req.user.role !== 'admin' && review.user.toString() !== req.user.id) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'You can only edit your own reviews.' });
    }
    const { rating, comment } = req.body;
    const updated = await Review.findByIdAndUpdate(req.params.id, { rating, comment }, { new: true, runValidators: true });
    res.status(HttpStatus.OK).json({ data: updated });
  } catch (error) { next(error); }
});

// DELETE /api/review/:id — owner or admin
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Review not found' });
    if (req.user.role !== 'admin' && review.user.toString() !== req.user.id) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'You can only delete your own reviews.' });
    }
    await Review.findByIdAndDelete(req.params.id);
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) { next(error); }
});

export default router;
