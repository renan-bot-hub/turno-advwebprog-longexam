import { Router } from 'express';
import * as UserController from '../controllers/userController.js';
import authentication from '../middleware/authentication.js';
import { loginLimiter, registerLimiter, loginLockout } from '../middleware/rateLimiterMiddleware.js';
import {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  changePasswordValidation,
} from '../middleware/validationMiddleware.js';

// Same account endpoints as /api/user/register, /login and /me, kept under /api/auth for the website
const router = Router();

router.post('/register', registerLimiter, registerValidation, UserController.registerUser);
router.post('/login', loginLimiter, loginValidation, loginLockout, UserController.loginUser);
router.get('/me', authentication, UserController.getMe);
router.put('/me', authentication, profileUpdateValidation, UserController.updateMe);
router.put('/me/password', authentication, changePasswordValidation, UserController.changePassword);

export default router;
