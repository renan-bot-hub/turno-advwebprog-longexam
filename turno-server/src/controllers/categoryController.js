import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
import { HttpStatus } from '../config/constants.js';
import { HttpError } from '../middleware/errorHandlerMiddleware.js';

function categoryInput({ name, description, imageUrl, isActive }) {
  return { name, description, imageUrl, isActive };
}

// GET / — with the number of products in each category
export async function getCategories(req, res, next) {
  try {
    const [categories, counts] = await Promise.all([
      Category.find().sort({ name: 1 }).lean(),
      Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    ]);
    const countById = new Map(counts.map((c) => [String(c._id), c.count]));
    const data = categories.map((c) => ({ ...c, productCount: countById.get(String(c._id)) || 0 }));
    res.status(HttpStatus.OK).json({ success: true, message: 'Categories retrieved successfully.', count: data.length, data });
  } catch (error) {
    next(error);
  }
}

// GET /:id
export async function getCategoryById(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) throw new HttpError(HttpStatus.NOT_FOUND, 'Category not found.');
    res.status(HttpStatus.OK).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

// POST / — Admin
export async function createCategory(req, res, next) {
  try {
    const category = await Category.create(categoryInput(req.body));
    res.status(HttpStatus.CREATED).json({ success: true, message: 'Category created successfully.', data: category });
  } catch (error) {
    next(error);
  }
}

// PUT /:id — Admin
export async function updateCategory(req, res, next) {
  try {
    const updates = Object.fromEntries(Object.entries(categoryInput(req.body)).filter(([, v]) => v !== undefined));
    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!category) throw new HttpError(HttpStatus.NOT_FOUND, 'Category not found.');
    res.status(HttpStatus.OK).json({ success: true, message: 'Category updated successfully.', data: category });
  } catch (error) {
    next(error);
  }
}

// DELETE /:id — Admin. Blocked while products still use the category
export async function deleteCategory(req, res, next) {
  try {
    const inUse = await Product.countDocuments({ category: req.params.id });
    if (inUse > 0) {
      throw new HttpError(HttpStatus.CONFLICT, `This category is used by ${inUse} product(s). Move or delete them first.`);
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new HttpError(HttpStatus.NOT_FOUND, 'Category not found.');
    res.status(HttpStatus.OK).json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
