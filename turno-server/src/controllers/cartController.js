import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import { HttpStatus } from '../config/constants.js';
import { HttpError } from '../middleware/errorHandlerMiddleware.js';

// Ownership check: customers can only touch their own cart; admins can see any
function checkCartOwner(req, userId) {
  if (req.user.role !== 'Admin' && req.user.id !== userId) {
    throw new HttpError(HttpStatus.FORBIDDEN, 'You can only access your own cart.');
  }
}

// Looks up current prices so the cart total can't be set by the client
async function buildCartItems(items = []) {
  if (!Array.isArray(items)) return [];
  const products = await Product.find({ _id: { $in: items.map((item) => item.product) } }).select('price');
  const priceById = new Map(products.map((product) => [product._id.toString(), product.price]));
  return items
    .filter((item) => priceById.has(String(item.product)))
    .map((item) => ({
      product: item.product,
      quantity: Math.max(1, Number.parseInt(item.quantity, 10) || 1),
      price: priceById.get(String(item.product)),
    }));
}

function cartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// GET /:userId — owner or Admin
export async function getCart(req, res, next) {
  try {
    checkCartOwner(req, req.params.userId);
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'title price imageUrl');
    if (!cart) throw new HttpError(HttpStatus.NOT_FOUND, 'Cart not found.');
    res.status(HttpStatus.OK).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
}

// POST / — creates the logged-in user's cart
export async function createCart(req, res, next) {
  try {
    const items = await buildCartItems(req.body.items);
    const cart = await Cart.create({ user: req.user.id, items, total: cartTotal(items) });
    res.status(HttpStatus.CREATED).json({ success: true, message: 'Cart created successfully.', data: cart });
  } catch (error) {
    next(error);
  }
}

// PUT /:userId — owner or Admin; creates the cart if it doesn't exist yet
export async function saveCart(req, res, next) {
  try {
    checkCartOwner(req, req.params.userId);
    const items = await buildCartItems(req.body.items);
    const cart = await Cart.findOneAndUpdate(
      { user: req.params.userId },
      { items, total: cartTotal(items) },
      { new: true, runValidators: true, upsert: true }
    );
    res.status(HttpStatus.OK).json({ success: true, message: 'Cart saved successfully.', data: cart });
  } catch (error) {
    next(error);
  }
}

// DELETE /:userId — owner or Admin
export async function deleteCart(req, res, next) {
  try {
    checkCartOwner(req, req.params.userId);
    const cart = await Cart.findOneAndDelete({ user: req.params.userId });
    if (!cart) throw new HttpError(HttpStatus.NOT_FOUND, 'Cart not found.');
    res.status(HttpStatus.OK).json({ success: true, message: 'Cart deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
