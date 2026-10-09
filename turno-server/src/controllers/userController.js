import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { HttpStatus } from '../config/constants.js';
import { HttpError } from '../middleware/errorHandlerMiddleware.js';
import { recordFailedLogin, clearFailedLogins } from '../middleware/rateLimiterMiddleware.js';

function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function publicUser(user) {
  return { id: user._id, name: user.name, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role };
}

function withoutPassword(user) {
  const { password: _password, ...rest } = user.toObject();
  return rest;
}

/* ── Registration and login (public) ── */

// POST /register — new accounts are always Customers; the password is hashed with bcrypt by the model
export async function registerUser(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (await User.exists({ email })) {
      throw new HttpError(HttpStatus.CONFLICT, 'An account with this email already exists.');
    }
    const user = await User.create({ name: `${firstName} ${lastName}`, firstName, lastName, email, password, role: 'Customer' });
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Account created successfully.',
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}

// POST /login — returns a JWT. Failed attempts count toward the lockout (see rateLimiterMiddleware)
export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      const { attempts, lockedMinutes } = recordFailedLogin(req);
      const message = lockedMinutes
        ? `Invalid email or password. After ${attempts} failed attempts, login is locked for ${lockedMinutes} minute(s).`
        : 'Invalid email or password.';
      return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message, failedAttempts: attempts });
    }
    // Checked after the password so this message doesn't reveal which emails exist
    if (!user.isActive) {
      throw new HttpError(HttpStatus.FORBIDDEN, 'Your account has been deactivated. Contact support.');
    }
    clearFailedLogins(req);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Login successful.',
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}

/* ── The logged-in user's own account ── */

// GET /me
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw new HttpError(HttpStatus.NOT_FOUND, 'User not found.');
    res.status(HttpStatus.OK).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

// PUT /me
export async function updateMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new HttpError(HttpStatus.NOT_FOUND, 'User not found.');
    for (const field of ['firstName', 'lastName', 'avatar']) {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    }
    user.name = `${user.firstName} ${user.lastName}`;
    await user.save();
    res.status(HttpStatus.OK).json({ success: true, message: 'Profile updated successfully.', data: withoutPassword(user) });
  } catch (error) {
    next(error);
  }
}

// PUT /me/password
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) throw new HttpError(HttpStatus.NOT_FOUND, 'User not found.');
    if (!(await user.comparePassword(currentPassword))) {
      // 400, not 401: the session is still valid, only the form input is wrong
      throw new HttpError(HttpStatus.BAD_REQUEST, 'Current password is incorrect.');
    }
    user.password = newPassword;
    await user.save();
    res.status(HttpStatus.OK).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
}

/* ── User management ── */

// GET / — Admin
export async function getAllUsers(req, res, next) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(HttpStatus.OK).json({ success: true, message: 'Users retrieved successfully.', count: users.length, data: users });
  } catch (error) {
    next(error);
  }
}

// GET /:id — Admin
export async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) throw new HttpError(HttpStatus.NOT_FOUND, 'User not found.');
    res.status(HttpStatus.OK).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

// POST / — Admin creates an account with any role
export async function createUser(req, res, next) {
  try {
    const { firstName, lastName, email, password, role, avatar, isActive } = req.body;
    const user = await User.create({ name: `${firstName} ${lastName}`, firstName, lastName, email, password, role, avatar, isActive });
    res.status(HttpStatus.CREATED).json({ success: true, message: 'User created successfully.', data: withoutPassword(user) });
  } catch (error) {
    next(error);
  }
}

// Ownership check: a user may edit only their own account unless they are an Admin
export function checkSelfOrAdmin(req) {
  const isAdmin = req.user.role === 'Admin';
  const isSelf = req.params.id === req.user.id;
  if (!isAdmin && !isSelf) {
    throw new HttpError(HttpStatus.FORBIDDEN, 'You can only edit your own account.');
  }
  return { isAdmin, isSelf };
}

// PUT/PATCH /:id — the account owner (name and avatar) or an Admin (everything).
// Only the fields that are sent are updated, so { isActive: false } alone works.
export async function updateUser(req, res, next) {
  try {
    const { isAdmin, isSelf } = checkSelfOrAdmin(req);
    const { role, isActive, email } = req.body;

    if (!isAdmin && (role !== undefined || isActive !== undefined || email !== undefined)) {
      throw new HttpError(HttpStatus.FORBIDDEN, 'Only admins can change the role, status, or email of an account.');
    }
    if (isAdmin && isSelf && (isActive === false || (role !== undefined && role !== 'Admin'))) {
      throw new HttpError(HttpStatus.BAD_REQUEST, 'You cannot deactivate or demote your own account.');
    }

    const user = await User.findById(req.params.id);
    if (!user) throw new HttpError(HttpStatus.NOT_FOUND, 'User not found.');

    const editable = isAdmin ? ['firstName', 'lastName', 'email', 'avatar', 'isActive', 'role'] : ['firstName', 'lastName', 'avatar'];
    for (const field of editable) {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    }
    user.name = `${user.firstName} ${user.lastName}`;
    await user.save();
    res.status(HttpStatus.OK).json({ success: true, message: 'User updated successfully.', data: withoutPassword(user) });
  } catch (error) {
    next(error);
  }
}

// DELETE /:id — Admin
export async function deleteUser(req, res, next) {
  try {
    if (req.params.id === req.user.id) {
      throw new HttpError(HttpStatus.BAD_REQUEST, 'You cannot delete your own account.');
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new HttpError(HttpStatus.NOT_FOUND, 'User not found.');
    res.status(HttpStatus.OK).json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
