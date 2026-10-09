import { Router } from 'express';
import * as ReviewController from '../controllers/reviewController.js';
import authentication from '../middleware/authentication.js';
import authorize from '../middleware/authorization.js';
import { writeLimiter } from '../middleware/rateLimiterMiddleware.js';
import { idParamValidation, reviewCreateValidation, reviewUpdateValidation } from '../middleware/validationMiddleware.js';

const router = Router();

// Public
router.get('/', ReviewController.getReviews);
router.get('/:id', idParamValidation, ReviewController.getReviewById);

// Logged-in users write reviews; editing and deleting is limited to the author or an Admin (checked in the controller)
router.post('/', authentication, authorize('Customer', 'Admin'), writeLimiter, reviewCreateValidation, ReviewController.createReview);
router.put('/:id', authentication, authorize('Customer', 'Admin'), idParamValidation, reviewUpdateValidation, ReviewController.updateReview);
router.delete('/:id', authentication, authorize('Customer', 'Admin'), idParamValidation, ReviewController.deleteReview);

export default router;
