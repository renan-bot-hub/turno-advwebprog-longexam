import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { HttpStatus } from '../config/constants.js';
import { HttpError } from '../middleware/errorHandlerMiddleware.js';

const POPULATE_USER = { path: 'user', select: 'firstName lastName email' };
const POPULATE_PRODUCT = { path: 'items.product', select: 'title price imageUrl' };

function restoreStock(items) {
  return Promise.all(items.map(({ product, quantity }) => (
    Product.updateOne({ _id: product }, { $inc: { stock: quantity } })
  )));
}

// GET / — customers see their own orders; admins see all and can filter by ?status= and ?userId=
export async function getOrders(req, res, next) {
  try {
    const filter = {};
    if (req.user.role === 'Customer') filter.user = req.user.id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.userId && req.user.role === 'Admin') filter.user = req.query.userId;

    const orders = await Order.find(filter).populate(POPULATE_USER).populate(POPULATE_PRODUCT).sort({ createdAt: -1 });
    res.status(HttpStatus.OK).json({ success: true, message: 'Orders retrieved successfully.', count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
}

// GET /:id — the customer who placed it, or an Admin
export async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate(POPULATE_USER).populate(POPULATE_PRODUCT);
    if (!order) throw new HttpError(HttpStatus.NOT_FOUND, 'Order not found.');
    if (req.user.role === 'Customer' && order.user?._id.toString() !== req.user.id) {
      throw new HttpError(HttpStatus.FORBIDDEN, 'You can only view your own orders.');
    }
    res.status(HttpStatus.OK).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

// POST / — prices and the total come from the database, never from the request body.
// Stock is reserved atomically so two orders can't oversell.
export async function createOrder(req, res, next) {
  const reserved = [];
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Combine duplicate lines for the same product
    const quantities = new Map();
    for (const item of items) {
      const productId = String(item.product);
      quantities.set(productId, (quantities.get(productId) || 0) + Number(item.quantity));
    }

    const orderItems = [];
    for (const [productId, quantity] of quantities) {
      const product = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );
      if (!product) {
        const existing = await Product.findById(productId).select('title stock');
        throw new HttpError(HttpStatus.BAD_REQUEST, existing
          ? `Only ${existing.stock} left of "${existing.title}". Please update your cart.`
          : 'A product in your cart is no longer available.');
      }
      reserved.push({ product: product._id, quantity });
      orderItems.push({ product: product._id, name: product.title, quantity, price: product.price });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total: orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
    });
    res.status(HttpStatus.CREATED).json({ success: true, message: 'Order placed successfully.', data: order });
  } catch (error) {
    await restoreStock(reserved);
    next(error);
  }
}

// PUT /:id — Admin updates the status. Cancelling puts the items back in stock.
export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) throw new HttpError(HttpStatus.NOT_FOUND, 'Order not found.');
    if (order.status === 'cancelled' && status !== 'cancelled') {
      throw new HttpError(HttpStatus.BAD_REQUEST, 'Cancelled orders cannot be reopened.');
    }

    if (status === 'cancelled' && order.status !== 'cancelled') await restoreStock(order.items);
    if (status === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
      if (order.paymentMethod === 'cod' && !order.paidAt) order.paidAt = order.deliveredAt;
    }
    order.status = status;
    await order.save();
    res.status(HttpStatus.OK).json({ success: true, message: 'Order status updated successfully.', data: order });
  } catch (error) {
    next(error);
  }
}

// DELETE /:id — Admin. An order that never completed gives its stock back
export async function deleteOrder(req, res, next) {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) throw new HttpError(HttpStatus.NOT_FOUND, 'Order not found.');
    if (!['cancelled', 'delivered'].includes(order.status)) await restoreStock(order.items);
    res.status(HttpStatus.OK).json({ success: true, message: 'Order deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
