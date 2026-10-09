import { Router } from 'express';
import * as CategoryController from '../controllers/categoryController.js';
import authentication from '../middleware/authentication.js';
import authorize from '../middleware/authorization.js';
import { idParamValidation, categoryValidation } from '../middleware/validationMiddleware.js';

const router = Router();

// Public
router.get('/', CategoryController.getCategories);
router.get('/:id', idParamValidation, CategoryController.getCategoryById);

// Admin only
router.post('/', authentication, authorize('Admin'), categoryValidation(), CategoryController.createCategory);
router.put('/:id', authentication, authorize('Admin'), idParamValidation, categoryValidation(true), CategoryController.updateCategory);
router.delete('/:id', authentication, authorize('Admin'), idParamValidation, CategoryController.deleteCategory);

export default router;
