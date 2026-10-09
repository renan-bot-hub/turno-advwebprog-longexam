import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { HttpStatus } from '../config/constants.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: 'No token provided. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
  }

  try {
    // Re-check the account so deactivated or deleted users lose access right away
    const user = await User.findById(decoded.id).select('isActive role');
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: 'Account no longer exists. Please log in again.' });
    }
    if (!user.isActive) {
      return res.status(HttpStatus.FORBIDDEN).json({ success: false, message: 'Your account has been deactivated. Contact support.' });
    }
    req.user = { ...decoded, id: user._id.toString(), role: user.role };
    next();
  } catch (error) {
    next(error);
  }
}

export default authenticate;
