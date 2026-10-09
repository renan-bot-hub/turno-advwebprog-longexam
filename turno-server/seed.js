import mongoose from 'mongoose';
import Product from './src/models/Product.js';
import User from './src/models/User.js';
import 'dotenv/config';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bulldogs_exchange';

const IMAGE_MAP = {
  'Fast Charge Power Bank': 'https://ecommerce.datablitz.com.ph/cdn/shop/files/dfbfdb_1dfa5b1d-0153-4b2c-b91d-f6dba679d87f_1024x.jpg?v=1703065790',
  'Water Flask': 'https://hydroflask.ph/cdn/shop/files/2100313069_1_1024x1024.jpg?v=1761293661',
  'Embroidered NU Cap': 'https://chrissports.com/cdn/shop/files/NU1_1_800x.jpg',
  '65W Multi-Port Fast Charger': 'https://anker.ph/cdn/shop/files/B2697J41_800x.png',
  'Official Bulldog Lanyard': 'https://varsitylifestyleco.com/cdn/shop/files/NULanyard.jpg',
  'Classic NU Sweatshirt': 'https://varsitylifestyleco.com/cdn/shop/files/NU_1_3f436c59-5a59-464c-a0f1-16aee5b27f00.jpg',
  'NU Heavyweight Hoodie': 'https://varsitylifestyleco.com/cdn/shop/files/NU1_c809a5da-e148-4e16-95ce-8084f3150cca.jpg',
  'NU Heritage Cotton Shirt': 'https://ph-live-01.slatic.net/p/mdc/dc6f40dc1118bce32be03e63248b19e2.jpg',
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
      console.log(`Updated image for: ${p.title}`);
    } else {
      console.log(`No image mapping for: ${p.title}`);
    }
  }

  // Create admin user if not exists
  const adminEmail = 'admin@bulldogex.com';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({
      name: 'Admin BulldogEx',
      firstName: 'Admin',
      lastName: 'BulldogEx',
      email: adminEmail,
      password: 'admin1234',
      role: 'Admin',
      isActive: true,
    });
    console.log('Admin user created: admin@bulldogex.com / admin1234');
  } else {
    // Make sure existing user is admin
    await User.findOneAndUpdate({ email: adminEmail }, { role: 'Admin', isActive: true });
    console.log('Admin user already exists (ensured role=Admin)');
  }

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch((e) => { console.error(e); process.exit(1); });
