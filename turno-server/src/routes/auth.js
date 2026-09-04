import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { HttpStatus } from '../config/constants.js';

const router = Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'All fields are required.' });
    }
    if (password.length < 6) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Password must be at least 6 characters.' });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(HttpStatus.CONFLICT).json({ message: 'An account with this email already exists.' });
    }
    const user = await User.create({ firstName, lastName, email, password, role: 'customer' });
    const token = signToken(user);
    res.status(HttpStatus.CREATED).json({
      message: 'Account created successfully.',
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid email or password.' });
    }
    if (!user.isActive) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Your account has been deactivated. Contact support.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid email or password.' });
    }
    const token = signToken(user);
    res.status(HttpStatus.OK).json({
      message: 'Login successful.',
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me — get current user profile
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found.' });
    res.status(HttpStatus.OK).json({ data: user });
  } catch (error) {
    next(error);
  }
});

// PUT /api/auth/me — edit own profile
router.put('/me', authenticate, async (req, res, next) => {
  try {
    const { firstName, lastName, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found.' });
    res.status(HttpStatus.OK).json({ message: 'Profile updated successfully.', data: user });
  } catch (error) {
    next(error);
  }
});

// PUT /api/auth/me/password — change own password
router.put('/me/password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Current and new passwords are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'New password must be at least 6 characters.' });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found.' });
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Current password is incorrect.' });
    }
    user.password = newPassword;
    await user.save();
    res.status(HttpStatus.OK).json({ message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
