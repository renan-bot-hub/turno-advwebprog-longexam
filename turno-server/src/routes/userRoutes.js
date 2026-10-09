import { Router } from 'express';
import * as UserController from '../controllers/userController.js';
import authentication from '../middleware/authentication.js';
import authorize from '../middleware/authorization.js';
import { loginLimiter, registerLimiter, loginLockout } from '../middleware/rateLimiterMiddleware.js';
import {
  idParamValidation,
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  changePasswordValidation,
  userCreateValidation,
  userUpdateValidation,
} from '../middleware/validationMiddleware.js';

const router = Router();

// Public: registration and login
router.post('/register', registerLimiter, registerValidation, UserController.registerUser);
router.post('/login', loginLimiter, loginValidation, loginLockout, UserController.loginUser);

// The logged-in user's own account
router.get('/me', authentication, UserController.getMe);
router.put('/me', authentication, profileUpdateValidation, UserController.updateMe);
router.put('/me/password', authentication, changePasswordValidation, UserController.changePassword);

// User management: Admin only
router.get('/', authentication, authorize('Admin'), UserController.getAllUsers);
router.get('/:id', authentication, authorize('Admin'), idParamValidation, UserController.getUserById);
router.post('/', authentication, authorize('Admin'), userCreateValidation, UserController.createUser);
router.delete('/:id', authentication, authorize('Admin'), idParamValidation, UserController.deleteUser);

// Editing: the account owner or an Admin (the controller checks which one)
router.put('/:id', authentication, idParamValidation, userUpdateValidation, UserController.updateUser);
router.patch('/:id', authentication, idParamValidation, userUpdateValidation, UserController.updateUser);

export default router;
