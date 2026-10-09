import { Router } from 'express';
import * as CartController from '../controllers/cartController.js';
import authentication from '../middleware/authentication.js';
import authorize from '../middleware/authorization.js';
import { userIdParamValidation, cartValidation } from '../middleware/validationMiddleware.js';

const router = Router();

// Every cart route needs a logged-in Customer or Admin; the controller checks ownership
router.use(authentication, authorize('Customer', 'Admin'));

router.get('/:userId', userIdParamValidation, CartController.getCart);
router.post('/', cartValidation, CartController.createCart);
router.put('/:userId', userIdParamValidation, cartValidation, CartController.saveCart);
router.delete('/:userId', userIdParamValidation, CartController.deleteCart);

export default router;
