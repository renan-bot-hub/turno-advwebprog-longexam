import { body, param, validationResult } from 'express-validator';
import { HttpStatus } from '../config/constants.js';

// Runs after the rules: stops the request with a 400 and a list of problems
function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array().map((error) => ({ field: error.path, message: error.msg }));
  return res.status(HttpStatus.BAD_REQUEST).json({
    success: false,
    message: errors[0].message,
    errors,
  });
}

const ORDER_STATUSES = ['pending', 'processing', 'ready', 'shipped', 'delivered', 'cancelled'];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PHONE_PATTERN = /^[0-9+()\-\s]{7,20}$/;

/* ── Reusable field rules ── */
const name = (field, label, { optional = false } = {}) => {
  const rule = body(field);
  return (optional ? rule.optional() : rule)
    .isString().withMessage(`${label} must be text.`)
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage(`${label} must be 2–50 characters long.`);
};
const email = (field = 'email', { optional = false } = {}) => {
  const rule = body(field);
  return (optional ? rule.optional() : rule)
    .isString().withMessage('Email must be text.')
    .trim()
    .toLowerCase()
    .isEmail().withMessage('Email must be a valid email address.');
};
const password = (field = 'password', label = 'Password', { optional = false } = {}) => {
  const rule = body(field);
  return (optional ? rule.optional() : rule)
    .isString().withMessage(`${label} must be text.`)
    .isLength({ min: 6, max: 128 }).withMessage(`${label} must be at least 6 characters long.`);
};
const descriptionRule = body('description')
  .optional()
  .custom((value) => typeof value === 'string' || (Array.isArray(value) && value.every((line) => typeof line === 'string')))
  .withMessage('Description must be text or a list of text lines.');

/* ── Route parameters ── */
export const idParamValidation = [
  param('id').isMongoId().withMessage('Invalid ID format.'),
  handleValidation,
];
export const userIdParamValidation = [
  param('userId').isMongoId().withMessage('Invalid user ID format.'),
  handleValidation,
];

/* ── Users and authentication ── */
export const registerValidation = [
  name('firstName', 'First name'),
  name('lastName', 'Last name'),
  email(),
  password(),
  handleValidation,
];

export const loginValidation = [
  email(),
  body('password').isString().notEmpty().withMessage('Password is required.'),
  handleValidation,
];

export const profileUpdateValidation = [
  name('firstName', 'First name', { optional: true }),
  name('lastName', 'Last name', { optional: true }),
  body('avatar').optional({ values: 'falsy' }).isURL().withMessage('Avatar must be a valid URL.'),
  body().custom((value) => value?.firstName !== undefined || value?.lastName !== undefined || value?.avatar !== undefined)
    .withMessage('Send at least one field to update.'),
  handleValidation,
];

export const changePasswordValidation = [
  body('currentPassword').isString().notEmpty().withMessage('Current password is required.'),
  password('newPassword', 'New password'),
  handleValidation,
];

export const userCreateValidation = [
  name('firstName', 'First name'),
  name('lastName', 'Last name'),
  email(),
  password(),
  body('role').optional().isIn(['Customer', 'Admin']).withMessage('Role must be Customer or Admin.'),
  body('isActive').optional().isBoolean({ strict: true }).withMessage('isActive must be true or false.'),
  handleValidation,
];

// Partial update: only the fields that are sent are checked
export const userUpdateValidation = [
  name('firstName', 'First name', { optional: true }),
  name('lastName', 'Last name', { optional: true }),
  email('email', { optional: true }),
  body('password').not().exists().withMessage('Change passwords with the change-password endpoint.'),
  body('role').optional().isIn(['Customer', 'Admin']).withMessage('Role must be Customer or Admin.'),
  body('isActive').optional().isBoolean({ strict: true }).withMessage('isActive must be true or false.'),
  body('avatar').optional({ values: 'falsy' }).isURL().withMessage('Avatar must be a valid URL.'),
  handleValidation,
];

/* ── Products (multipart form fields arrive as text, so numbers are checked as text) ── */
const productRules = ({ optional }) => {
  const field = (path) => (optional ? body(path).optional() : body(path));
  return [
    field('name').isString().trim().toLowerCase()
      .matches(SLUG_PATTERN).withMessage('Slug name may only contain lowercase letters, numbers, and hyphens (e.g. nu-varsity-cap).')
      .isLength({ max: 80 }).withMessage('Slug name must be at most 80 characters.'),
    field('title').isString().trim().isLength({ min: 2, max: 120 }).withMessage('Title must be 2–120 characters long.'),
    field('category').isString().trim().notEmpty().withMessage('Category is required.'),
    body('supplier').optional().isString().withMessage('Supplier must be an ID or name.'),
    field('price').isFloat({ min: 0, max: 1000000 }).withMessage('Price must be a number from 0 to 1,000,000.').toFloat(),
    field('stock').isInt({ min: 0, max: 100000 }).withMessage('Stock must be a whole number from 0 to 100,000.').toInt(),
    descriptionRule,
    body('imageUrl').optional({ values: 'falsy' }).isURL().withMessage('Image URL must be a valid URL.'),
    handleValidation,
  ];
};
export const productCreateValidation = productRules({ optional: false });
export const productUpdateValidation = productRules({ optional: true });

/* ── Categories and suppliers ── */
export const categoryValidation = (optional = false) => [
  (optional ? body('name').optional() : body('name'))
    .isString().trim().isLength({ min: 2, max: 60 }).withMessage('Category name must be 2–60 characters long.'),
  body('description').optional().isString().trim().isLength({ max: 300 }).withMessage('Description must be at most 300 characters.'),
  body('imageUrl').optional({ values: 'falsy' }).isURL().withMessage('Image URL must be a valid URL.'),
  body('isActive').optional().isBoolean({ strict: true }).withMessage('isActive must be true or false.'),
  handleValidation,
];

export const supplierValidation = (optional = false) => [
  (optional ? body('name').optional() : body('name'))
    .isString().trim().isLength({ min: 2, max: 80 }).withMessage('Supplier name must be 2–80 characters long.'),
  body('contactPerson').optional().isString().trim().isLength({ max: 80 }).withMessage('Contact person must be at most 80 characters.'),
  body('email').optional({ values: 'falsy' }).isString().trim().toLowerCase().isEmail().withMessage('Supplier email must be a valid email address.'),
  body('phone').optional({ values: 'falsy' }).matches(PHONE_PATTERN).withMessage('Phone must be 7–20 digits and may include + ( ) -.'),
  body('address').optional().isString().trim().isLength({ max: 200 }).withMessage('Address must be at most 200 characters.'),
  body('isActive').optional().isBoolean({ strict: true }).withMessage('isActive must be true or false.'),
  handleValidation,
];

/* ── Reviews ── */
export const reviewCreateValidation = [
  body('product').isMongoId().withMessage('A valid product ID is required.'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be a whole number from 1 to 5.').toInt(),
  body('comment').optional().isString().trim().isLength({ max: 1000 }).withMessage('Comment must be at most 1000 characters.'),
  handleValidation,
];

export const reviewUpdateValidation = [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be a whole number from 1 to 5.').toInt(),
  body('comment').optional().isString().trim().isLength({ max: 1000 }).withMessage('Comment must be at most 1000 characters.'),
  handleValidation,
];

/* ── Orders and carts ── */
export const orderCreateValidation = [
  body('items').isArray({ min: 1, max: 50 }).withMessage('Order must have between 1 and 50 items.'),
  body('items.*.product').isMongoId().withMessage('Each item needs a valid product ID.'),
  body('items.*.quantity').isInt({ min: 1, max: 100 }).withMessage('Each quantity must be a whole number from 1 to 100.').toInt(),
  body('shippingAddress').optional().isObject().withMessage('Shipping address must be an object.'),
  body('paymentMethod').optional().isIn(['cod']).withMessage('Payment method must be "cod" (cash on pickup).'),
  handleValidation,
];

export const orderStatusValidation = [
  body('status').isIn(ORDER_STATUSES).withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}.`),
  handleValidation,
];

export const cartValidation = [
  body('items').optional().isArray({ max: 50 }).withMessage('Items must be a list of at most 50 entries.'),
  body('items.*.product').optional().isMongoId().withMessage('Each item needs a valid product ID.'),
  body('items.*.quantity').optional().isInt({ min: 1, max: 100 }).withMessage('Each quantity must be a whole number from 1 to 100.').toInt(),
  handleValidation,
];
