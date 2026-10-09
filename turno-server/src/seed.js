import 'dotenv/config';
import mongoose from 'mongoose';
import { seedDatabase } from './seedData.js';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bulldogs_exchange';

try {
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  const result = await seedDatabase();
  if (result.migratedProducts) console.log(`Converted ${result.migratedProducts} product(s) to category references.`);
  console.log(result.productsAdded
    ? `Database was empty: added ${result.productsAdded} sample products.`
    : `Kept your ${result.existingProducts} existing products (nothing was deleted).`);
  console.log(`Categories added: ${result.categoriesAdded}, suppliers added: ${result.suppliersAdded}`);
  console.log(`Admin account ready: ${result.adminEmail}`);
} catch (error) {
  console.error('Could not seed database:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
