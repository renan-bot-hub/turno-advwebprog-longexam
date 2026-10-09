import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import { HttpStatus } from '../config/constants.js';
import { HttpError } from '../middleware/errorHandlerMiddleware.js';

const POPULATE = [
  { path: 'user', select: 'firstName lastName' },
  { path: 'product', select: 'title' },
];

// Ownership check: only the author or an Admin may change a review
function checkReviewOwner(req, review) {
  if (req.user.role !== 'Admin' && review.user.toString() !== req.user.id) {
    throw new HttpError(HttpStatus.FORBIDDEN, 'You can only change your own reviews.');
  }
}

// GET / — public; filter with ?productId= or ?userId=
export async function getReviews(req, res, next) {
  try {
    const filter = {};
    if (req.query.productId) filter.product = req.query.productId;
    if (req.query.userId) filter.user = req.query.userId;
    const reviews = await Review.find(filter).populate(POPULATE).sort({ createdAt: -1 });
    res.status(HttpStatus.OK).json({ success: true, message: 'Reviews retrieved successfully.', count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
}

// GET /:id — public
export async function getReviewById(req, res, next) {
  try {
    const review = await Review.findById(req.params.id).populate(POPULATE);
    if (!review) throw new HttpError(HttpStatus.NOT_FOUND, 'Review not found.');
    res.status(HttpStatus.OK).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}

// POST / — any logged-in user; one review per user per product
export async function createReview(req, res, next) {
  try {
    const { product, rating, comment } = req.body;
    if (!(await Product.exists({ _id: product }))) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Product not found.');
    }
    const review = await Review.create({ user: req.user.id, product, rating, comment });
    res.status(HttpStatus.CREATED).json({ success: true, message: 'Review submitted successfully.', data: review });
  } catch (error) {
    next(error);
  }
}

// PUT /:id — author or Admin
export async function updateReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) throw new HttpError(HttpStatus.NOT_FOUND, 'Review not found.');
    checkReviewOwner(req, review);
    if (req.body.rating !== undefined) review.rating = req.body.rating;
    if (req.body.comment !== undefined) review.comment = req.body.comment;
    await review.save();
    res.status(HttpStatus.OK).json({ success: true, message: 'Review updated successfully.', data: review });
  } catch (error) {
    next(error);
  }
}

// DELETE /:id — author or Admin
export async function deleteReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) throw new HttpError(HttpStatus.NOT_FOUND, 'Review not found.');
    checkReviewOwner(req, review);
    await review.deleteOne();
    res.status(HttpStatus.OK).json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
