import { HttpStatus } from '../config/constants.js';

// Role-based access control. Usage: authorize('Admin') or authorize('Admin', 'Customer').
// Must run after authenticate, which sets req.user.
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}.`,
      });
    }
    next();
  };
}

export default authorize;
