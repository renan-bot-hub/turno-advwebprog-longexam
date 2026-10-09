import mongoose from 'mongoose';
import { HttpStatus } from '../config/constants.js';

// Thrown by controllers to send a specific status and message
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function duplicateKeyMessage(error) {
  const fields = Object.keys(error.keyValue || error.keyPattern || {});
  if (fields.includes('email')) return 'An account with this email already exists.';
  if (fields.includes('user') && fields.includes('product')) return 'You have already reviewed this product.';
  if (fields.includes('user')) return 'A cart already exists for this user.';
  if (fields.includes('name')) return 'An item with this name already exists.';
  return 'Duplicate value. This record already exists.';
}

// Unknown /api routes
export function notFoundHandler(req, res) {
  res.status(HttpStatus.NOT_FOUND).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Centralized error handling: every error ends here and gets a consistent JSON response
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, next) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ success: false, message: error.message });
  }
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map((e) => ({ field: e.path, message: e.message }));
    return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: errors[0]?.message || 'Validation failed.', errors });
  }
  if (error instanceof mongoose.Error.CastError) {
    return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: `Invalid value for ${error.path}.` });
  }
  if (error?.code === 11000) {
    return res.status(HttpStatus.CONFLICT).json({ success: false, message: duplicateKeyMessage(error) });
  }
  if (error?.type === 'entity.parse.failed') {
    return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: 'The request body is not valid JSON.' });
  }
  if (error?.type === 'entity.too.large') {
    return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: 'The request body is too large.' });
  }

  console.error(error);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error. Please try again later.' });
}
