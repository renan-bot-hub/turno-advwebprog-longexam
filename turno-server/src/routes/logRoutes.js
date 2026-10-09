import { Router } from 'express';
import * as LogController from '../controllers/logController.js';
import authentication from '../middleware/authentication.js';
import authorize from '../middleware/authorization.js';

const router = Router();

// Admin only: view the audit log
router.get('/', authentication, authorize('Admin'), LogController.getLogs);

export default router;
