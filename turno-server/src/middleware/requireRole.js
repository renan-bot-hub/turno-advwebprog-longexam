import { HttpStatus } from '../config/constants.js';

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: `Access denied. Required role: ${roles.join(' or ')}.`,
      });
    }
    next();
  };
}
