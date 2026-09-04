import mongoose from 'mongoose';
import Product from './src/models/Product.js';
import User from './src/models/User.js';
import 'dotenv/config';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bulldogs_exchange';

const IMAGE_MAP = {
  'Official Bulldog Lanyard': 'https://varsitylifestyleco.com/cdn/shop/files/NULanyard.jpg',
  'NU Heavyweight Hoodie': 'https://ph-live-01.slatic.net/p/mdc/dc6f40dc1118bce32be03e63248b19e2.jpg',
  'Water Flask': 'https://m.media-amazon.com/images/I/71KQ29l0fAL._AC_SX679_.jpg',
  'Embroidered NU Cap': 'https://varsitylifestyleco.com/cdn/shop/products/NU_Cap_1_grande.jpg',
  '65W Multi-Port Fast Charger': 'https://m.media-amazon.com/images/I/61GlI0S0uDL._AC_SX679_.jpg',
  'Fast Charge Power Bank': 'https://m.media-amazon.com/images/I/61NsijHclkL._AC_SX679_.jpg',
};

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Update product images
  const products = await Product.find();
  for (const p of products) {
    const img = IMAGE_MAP[p.title];
    if (img) {
      await Product.findByIdAndUpdate(p._id, { imageUrl: img });
      console.log(`✅ Updated image for: ${p.title}`);
    } else {
      console.log(`⚠️  No image mapping for: ${p.title}`);
    }
  }

  // Create admin user if not exists
  const adminEmail = 'admin@bulldogex.com';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({
      firstName: 'Admin',
      lastName: 'BulldogEx',
      email: adminEmail,
      password: 'admin1234',
      role: 'admin',
      isActive: true,
    });
    console.log('✅ Admin user created: admin@bulldogex.com / admin1234');
  } else {
    // Make sure existing user is admin
    await User.findOneAndUpdate({ email: adminEmail }, { role: 'admin', isActive: true });
    console.log('✅ Admin user already exists (ensured role=admin)');
  }

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch((e) => { console.error(e); process.exit(1); });
