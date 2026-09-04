import jwt from 'jsonwebtoken';
import { HttpStatus } from '../config/constants.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No token provided. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired token. Please log in again.' });
  }
}
