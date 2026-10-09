import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

// One-time upgrade for databases created before categories were referenced by ObjectId.
// Older products store the category as plain text ("Campus Apparel"); this replaces each one
// with the _id of a matching Category document (creating the category if needed).
// Safe to run on every start: products that already use an ObjectId are not touched.
export async function migrateLegacyData() {
  const legacyProducts = await Product.collection
    .find({ category: { $type: 'string' } }, { projection: { category: 1 } })
    .toArray();
  if (legacyProducts.length === 0) return { migratedProducts: 0 };

  const idByName = new Map();
  for (const product of legacyProducts) {
    const name = product.category.trim();
    if (!idByName.has(name)) {
      const category = await Category.findOneAndUpdate(
        { name },
        { $setOnInsert: { name, description: '' } },
        { upsert: true, new: true }
      );
      idByName.set(name, category._id);
    }
    await Product.collection.updateOne({ _id: product._id }, { $set: { category: idByName.get(name) } });
  }

  console.log(`Migrated ${legacyProducts.length} product(s) to category references.`);
  return { migratedProducts: legacyProducts.length };
}
