import { Router } from 'express';
import * as ProductController from '../controllers/productController.js';
import authentication from '../middleware/authentication.js';
import authorize from '../middleware/authorization.js';
import { uploadImage, verifyImageContent } from '../middleware/uploadImageMiddleware.js';
import { writeLimiter } from '../middleware/rateLimiterMiddleware.js';
import { idParamValidation, productCreateValidation, productUpdateValidation } from '../middleware/validationMiddleware.js';

const router = Router();

// Public
router.get('/', ProductController.getProducts);
router.get('/:id', idParamValidation, ProductController.getProductById);

// Admin only. Multipart requests: upload (memory) → check real file type → validate fields → controller
router.post('/', authentication, authorize('Admin'), uploadImage, verifyImageContent, productCreateValidation, ProductController.createProduct);
router.put('/:id', authentication, authorize('Admin'), idParamValidation, uploadImage, verifyImageContent, productUpdateValidation, ProductController.updateProduct);
router.patch('/:id', authentication, authorize('Admin'), idParamValidation, uploadImage, verifyImageContent, productUpdateValidation, ProductController.updateProduct);
router.post('/:id/upload-image', authentication, authorize('Admin'), writeLimiter, idParamValidation, uploadImage, verifyImageContent, ProductController.uploadProductImage);
router.delete('/:id/image', authentication, authorize('Admin'), idParamValidation, ProductController.deleteProductImage);
router.delete('/:id', authentication, authorize('Admin'), idParamValidation, ProductController.deleteProduct);

export default router;
