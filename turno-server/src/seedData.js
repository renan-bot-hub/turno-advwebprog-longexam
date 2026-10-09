import Product from './models/productModel.js';
import Category from './models/categoryModel.js';
import Supplier from './models/supplierModel.js';
import User from './models/userModel.js';
import { migrateLegacyData } from './utils/migrateLegacyData.js';

const categories = [
  { name: 'Campus Apparel', description: 'Hoodies, shirts, caps, and NU merch for every Bulldog.' },
  { name: 'Study Supplies', description: 'Chargers, desk tools, and gear for class and review season.' },
  { name: 'Daily Essentials', description: 'Lanyards, tumblers, power banks, and everyday campus items.' },
];

const suppliers = [
  { name: 'Bulldog Merch Co.', contactPerson: 'Ana Reyes', email: 'orders@bulldogmerch.test', phone: '(02) 8000-1001', address: 'Sampaloc, Manila' },
  { name: 'Campus Tech Supply', contactPerson: 'Marco Lim', email: 'sales@campustech.test', phone: '(02) 8000-1002', address: 'Quiapo, Manila' },
  { name: 'NU Essentials Trading', contactPerson: 'Jessa Cruz', email: 'hello@nuessentials.test', phone: '(02) 8000-1003', address: 'España Blvd, Manila' },
];

// Sample catalog (category and supplier given by name, turned into ObjectIds when inserted)
const products = [
  { name: 'nu-powerbank-10000mah', title: 'Fast Charge Power Bank', category: 'Daily Essentials', supplier: 'Campus Tech Supply', price: 1299, stock: 25, description: ['A lifesaver for long days on campus.', 'Dual USB-C ports charge two devices at once.'], imageUrl: 'https://ecommerce.datablitz.com.ph/cdn/shop/files/dfbfdb_1dfa5b1d-0153-4b2c-b91d-f6dba679d87f_1024x.jpg?v=1703065790' },
  { name: 'nu-insulated-flask', title: 'Water Flask', category: 'Daily Essentials', supplier: 'NU Essentials Trading', price: 750, stock: 30, description: ['18/8 food-grade stainless steel flask.', 'Double-walled vacuum seal keeps drinks cold for up to 24 hours.'], imageUrl: 'https://hydroflask.ph/cdn/shop/files/2100313069_1_1024x1024.jpg?v=1761293661' },
  { name: 'nu-varsity-cap', title: 'Embroidered NU Cap', category: 'Campus Apparel', supplier: 'Bulldog Merch Co.', price: 450, stock: 8, description: ['Premium adjustable cotton twill cap.', 'NU Bulldog emblem stitched in academic gold.'], imageUrl: 'https://chrissports.com/cdn/shop/files/NU1_1_800x.jpg' },
  { name: 'nu-gan-charger', title: '65W Multi-Port Fast Charger', category: 'Study Supplies', supplier: 'Campus Tech Supply', price: 950, stock: 18, description: ['Two USB-C and one USB-A port.', 'Compact GaN technology prevents overheating.'], imageUrl: 'https://anker.ph/cdn/shop/files/B2697J41_800x.png' },
  { name: 'nu-official-lanyard', title: 'Official Bulldog Lanyard', category: 'Daily Essentials', supplier: 'NU Essentials Trading', price: 150, stock: 60, description: ['Durable polyester webbing with a metal clasp.', 'Keeps campus IDs and keys secure.'], imageUrl: 'https://varsitylifestyleco.com/cdn/shop/files/NULanyard.jpg' },
  { name: 'nu-classic-sweatshirt', title: 'Classic NU Sweatshirt', category: 'Campus Apparel', supplier: 'Bulldog Merch Co.', price: 1150, stock: 14, description: ['Soft cotton blend for cool lecture halls.', 'A classic collegiate layer for study sessions.'], imageUrl: 'https://varsitylifestyleco.com/cdn/shop/files/NU_1_3f436c59-5a59-464c-a0f1-16aee5b27f00.jpg' },
  { name: 'nu-heavyweight-hoodie', title: 'NU Heavyweight Hoodie', category: 'Campus Apparel', supplier: 'Bulldog Merch Co.', price: 1250, stock: 11, description: ['Premium heavyweight hoodie with Bulldog mascot.', 'Brushed interior and spacious kangaroo pocket.'], imageUrl: 'https://varsitylifestyleco.com/cdn/shop/files/NU1_c809a5da-e148-4e16-95ce-8084f3150cca.jpg' },
  { name: 'nu-heritage-shirt', title: 'NU Heritage Cotton Shirt', category: 'Campus Apparel', supplier: 'Bulldog Merch Co.', price: 499, stock: 22, description: ['Navy tee with vintage NU gold screen-print.', 'Breathable high-grade cotton for daily wear.'], imageUrl: 'https://ph-live-01.slatic.net/p/mdc/dc6f40dc1118bce32be03e63248b19e2.jpg' },
];

// Adds anything missing (by name) without changing existing documents; returns name -> _id
async function ensureByName(Model, docs) {
  const idByName = new Map();
  let added = 0;
  for (const doc of docs) {
    const result = await Model.findOneAndUpdate(
      { name: doc.name },
      { $setOnInsert: doc },
      { upsert: true, new: true, includeResultMetadata: true }
    );
    if (!result.lastErrorObject?.updatedExisting) added += 1;
    idByName.set(doc.name, result.value._id);
  }
  return { idByName, added };
}

// Never deletes or changes your products:
// - old products with text categories are converted to category references
// - sample categories and suppliers are added if missing
// - sample products are only added when the database has no products at all
// - the admin account is created (or re-enabled)
export async function seedDatabase() {
  const { migratedProducts } = await migrateLegacyData();
  const { idByName: categoryIds, added: categoriesAdded } = await ensureByName(Category, categories);
  const { idByName: supplierIds, added: suppliersAdded } = await ensureByName(Supplier, suppliers);

  const existingProducts = await Product.countDocuments();
  let productsAdded = 0;
  if (existingProducts === 0) {
    await Product.insertMany(products.map((p) => ({
      ...p,
      category: categoryIds.get(p.category),
      supplier: supplierIds.get(p.supplier),
    })));
    productsAdded = products.length;
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@bulldogex.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
  const admin = await User.findOne({ email: adminEmail });
  if (admin) {
    admin.role = 'Admin';
    admin.isActive = true;
    await admin.save();
  } else {
    await User.create({
      name: 'Admin BulldogEx',
      firstName: 'Admin',
      lastName: 'BulldogEx',
      email: adminEmail,
      password: adminPassword,
      role: 'Admin',
    });
  }

  return { migratedProducts, existingProducts, productsAdded, categoriesAdded, suppliersAdded, adminEmail };
}
