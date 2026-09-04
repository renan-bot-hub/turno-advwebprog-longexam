import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    description: { type: [String], default: [] },
    imageUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ title: 'text', name: 'text', category: 'text' });

export default mongoose.model('Product', productSchema);
