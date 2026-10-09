import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    // Referenced documents: many products share one category / supplier
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    description: { type: [String], default: [] },
    imageUrl: { type: String, trim: true },
    // Cloudinary id of the current image, so it can be deleted when replaced
    imagePublicId: { type: String, trim: true },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ supplier: 1 });
productSchema.index({ price: 1 });
// Keyword search. Kept identical to the original definition: MongoDB allows only one text index per collection
productSchema.index({ title: 'text', name: 'text', category: 'text' });

export default mongoose.model('Product', productSchema);
