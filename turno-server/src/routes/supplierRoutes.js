import { Router } from 'express';
import * as SupplierController from '../controllers/supplierController.js';
import authentication from '../middleware/authentication.js';
import authorize from '../middleware/authorization.js';
import { idParamValidation, supplierValidation } from '../middleware/validationMiddleware.js';

const router = Router();

// Public
router.get('/', SupplierController.getSuppliers);
router.get('/:id', idParamValidation, SupplierController.getSupplierById);

// Admin only
router.post('/', authentication, authorize('Admin'), supplierValidation(), SupplierController.createSupplier);
router.put('/:id', authentication, authorize('Admin'), idParamValidation, supplierValidation(true), SupplierController.updateSupplier);
router.delete('/:id', authentication, authorize('Admin'), idParamValidation, SupplierController.deleteSupplier);

export default router;
