import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Cart from './models/Cart.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import User from './models/User.js';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bulldogs_exchange';

try {
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB.');

  // ─── Clear all collections ───────────────────────────────────────────────────
  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({}),
    User.deleteMany({}),
  ]);
  console.log('Cleared all collections.');

  // ─── 1. Categories ───────────────────────────────────────────────────────────
  const categories = await Category.insertMany([
    { name: 'Campus Apparel', description: 'Official NU branded clothing and accessories.' },
    { name: 'Daily Essentials', description: 'Everyday items every Bulldog needs on campus.' },
    { name: 'Study Supplies', description: 'Tools and gadgets to boost your study sessions.' },
  ]);
  console.log(`Seeded ${categories.length} categories.`);

  // ─── 2. Products ─────────────────────────────────────────────────────────────
  const products = await Product.insertMany([
    { name: 'nu-powerbank-10000mah', title: 'Fast Charge Power Bank', category: 'Daily Essentials', price: 1299, stock: 25, description: ['Dual USB-C ports charge two devices at once.', 'A lifesaver for long days on campus.'] },
    { name: 'nu-insulated-flask', title: 'Water Flask', category: 'Daily Essentials', price: 750, stock: 30, description: ['18/8 food-grade stainless steel flask.', 'Double-walled vacuum seal keeps drinks cold for up to 24 hours.'] },
    { name: 'nu-varsity-cap', title: 'Embroidered NU Cap', category: 'Campus Apparel', price: 450, stock: 8, description: ['Premium adjustable cotton twill cap.', 'NU Bulldog emblem stitched in academic gold.'] },
    { name: 'nu-gan-charger', title: '65W Multi-Port Fast Charger', category: 'Study Supplies', price: 950, stock: 18, description: ['Two USB-C and one USB-A port.', 'Compact GaN technology prevents overheating.'] },
    { name: 'nu-official-lanyard', title: 'Official Bulldog Lanyard', category: 'Daily Essentials', price: 150, stock: 60, description: ['Durable polyester webbing with a metal clasp.', 'Keeps campus IDs and keys secure.'] },
    { name: 'nu-heavyweight-hoodie', title: 'NU Heavyweight Hoodie', category: 'Campus Apparel', price: 1250, stock: 11, description: ['Premium heavyweight hoodie with Bulldog mascot.', 'Brushed interior and spacious kangaroo pocket.'] },
  ]);
  console.log(`Seeded ${products.length} products.`);

  // ─── 3. Users ────────────────────────────────────────────────────────────────
  const users = await User.insertMany([
    { firstName: 'Juan', lastName: 'dela Cruz', email: 'juan.delacruz@nu.edu.ph', password: 'hashed_password_1', role: 'customer' },
    { firstName: 'Maria', lastName: 'Santos', email: 'maria.santos@nu.edu.ph', password: 'hashed_password_2', role: 'customer' },
    { firstName: 'Admin', lastName: 'Bulldog', email: 'admin@nu.edu.ph', password: 'hashed_admin_password', role: 'admin' },
  ]);
  console.log(`Seeded ${users.length} users.`);

  // ─── 4. Carts ────────────────────────────────────────────────────────────────
  const carts = await Cart.insertMany([
    {
      user: users[0]._id,
      items: [
        { product: products[0]._id, quantity: 1, price: products[0].price },
        { product: products[1]._id, quantity: 2, price: products[1].price },
      ],
      total: products[0].price + products[1].price * 2,
    },
    {
      user: users[1]._id,
      items: [
        { product: products[2]._id, quantity: 1, price: products[2].price },
        { product: products[5]._id, quantity: 1, price: products[5].price },
      ],
      total: products[2].price + products[5].price,
    },
    {
      user: users[2]._id,
      items: [
        { product: products[3]._id, quantity: 3, price: products[3].price },
      ],
      total: products[3].price * 3,
    },
  ]);
  console.log(`Seeded ${carts.length} carts.`);

  // ─── 5. Orders ───────────────────────────────────────────────────────────────
  const orders = await Order.insertMany([
    {
      user: users[0]._id,
      items: [
        { product: products[0]._id, name: products[0].title, quantity: 1, price: products[0].price },
      ],
      total: products[0].price,
      status: 'delivered',
      shippingAddress: { street: '551 M.F. Jhocson St.', city: 'Manila', province: 'Metro Manila', zipCode: '1008' },
      paymentMethod: 'gcash',
      paidAt: new Date('2026-08-01'),
      deliveredAt: new Date('2026-08-03'),
    },
    {
      user: users[1]._id,
      items: [
        { product: products[2]._id, name: products[2].title, quantity: 2, price: products[2].price },
        { product: products[4]._id, name: products[4].title, quantity: 1, price: products[4].price },
      ],
      total: products[2].price * 2 + products[4].price,
      status: 'processing',
      shippingAddress: { street: '157 A. Roces Ave.', city: 'Quezon City', province: 'Metro Manila', zipCode: '1103' },
      paymentMethod: 'cod',
    },
    {
      user: users[0]._id,
      items: [
        { product: products[5]._id, name: products[5].title, quantity: 1, price: products[5].price },
      ],
      total: products[5].price,
      status: 'pending',
      shippingAddress: { street: '551 M.F. Jhocson St.', city: 'Manila', province: 'Metro Manila', zipCode: '1008' },
      paymentMethod: 'cod',
    },
  ]);
  console.log(`Seeded ${orders.length} orders.`);

  // ─── 6. Reviews ──────────────────────────────────────────────────────────────
  const reviews = await Review.insertMany([
    { user: users[0]._id, product: products[0]._id, rating: 5, comment: 'Best power bank I have ever bought! Charges super fast.' },
    { user: users[1]._id, product: products[0]._id, rating: 4, comment: 'Very reliable, perfect for long school days.' },
    { user: users[0]._id, product: products[2]._id, rating: 5, comment: 'Love the embroidery quality, very premium feel.' },
    { user: users[1]._id, product: products[5]._id, rating: 5, comment: 'So comfy and warm! Great for cold classroom.' },
    { user: users[2]._id, product: products[3]._id, rating: 4, comment: 'Charges my laptop and phone at the same time. Compact too.' },
  ]);
  console.log(`Seeded ${reviews.length} reviews.`);

  console.log('\n✅ All collections seeded successfully!');
} catch (error) {
  console.error('Seeding failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}
