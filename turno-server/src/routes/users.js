import { Router } from 'express';
import User from '../models/User.js';
import { HttpStatus } from '../config/constants.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// All user management routes require admin
router.use(authenticate, requireRole('admin'));

// GET /api/user
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(HttpStatus.OK).json({ data: users });
  } catch (error) { next(error); }
});

// GET /api/user/:id
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
    res.status(HttpStatus.OK).json(user);
  } catch (error) { next(error); }
});

// POST /api/user
router.post('/', async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, avatar } = req.body;
    const user = await User.create({ firstName, lastName, email, password, role, avatar });
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(HttpStatus.CREATED).json(userWithoutPassword);
  } catch (error) { next(error); }
});

// PUT /api/user/:id — admin can edit any user, set active/inactive
router.put('/:id', async (req, res, next) => {
  try {
    const { firstName, lastName, email, avatar, isActive, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, avatar, isActive, role },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
    res.status(HttpStatus.OK).json({ data: user });
  } catch (error) { next(error); }
});

// DELETE /api/user/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) { next(error); }
});

export default router;
