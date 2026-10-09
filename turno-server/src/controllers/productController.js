import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import Supplier from '../models/supplierModel.js';
import cloudinary from '../config/cloudinary.js';
import { HttpStatus } from '../config/constants.js';
import { HttpError } from '../middleware/errorHandlerMiddleware.js';

const SORT_FIELDS = ['name', 'title', 'price', 'stock', 'createdAt'];
const POPULATE = [
  { path: 'category', select: 'name' },
  { path: 'supplier', select: 'name' },
];
const OBJECT_ID = /^[a-f\d]{24}$/i;
const CLOUDINARY_FOLDER = 'bulldogs-exchange/products';

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Finds a category/supplier by ObjectId or by name (case-insensitive); returns its _id or null
async function findReferenceId(Model, value) {
  const text = String(value).trim();
  const query = OBJECT_ID.test(text) ? { _id: text } : { name: new RegExp(`^${escapeRegex(text)}$`, 'i') };
  const doc = await Model.findOne(query).select('_id');
  return doc?._id ?? null;
}

// Like findReferenceId, but an unknown value is a 400 error. undefined = "not sent, leave unchanged"
async function resolveReference(Model, value, label, { optional = false } = {}) {
  if (value === undefined) return undefined;
  if (value === null || String(value).trim() === '') {
    if (optional) return null;
    throw new HttpError(HttpStatus.BAD_REQUEST, `${label} is required.`);
  }
  const id = await findReferenceId(Model, value);
  if (!id) throw new HttpError(HttpStatus.BAD_REQUEST, `${label} "${value}" does not exist.`);
  return id;
}

function parseProductInput(body = {}) {
  return {
    name: body.name,
    title: body.title,
    price: body.price,
    stock: body.stock,
    // Left undefined when not sent, so a partial update doesn't wipe the description
    description: body.description === undefined
      ? undefined
      : Array.isArray(body.description)
        ? body.description
        : String(body.description).split('\n').map((line) => line.trim()).filter(Boolean),
    imageUrl: body.imageUrl,
  };
}

function hasCloudinaryConfig() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    if (!hasCloudinaryConfig()) {
      reject(new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Image uploads are not configured: the Cloudinary keys are missing from .env.'));
      return;
    }
    const stream = cloudinary.uploader.upload_stream({ folder: CLOUDINARY_FOLDER }, (error, result) => {
      if (error) reject(new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, `Image upload failed: ${error.message}`));
      else resolve(result);
    });
    stream.end(buffer);
  });
}

// Asset management: removes an image from Cloudinary. Failures are logged, not fatal.
async function deleteCloudinaryImage(publicId) {
  if (!publicId || !hasCloudinaryConfig()) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Could not delete Cloudinary image ${publicId}:`, error.message);
  }
}

// GET / — pagination, filtering (category, supplier, price range), keyword search, and sorting can all be combined
// e.g. ?page=1&limit=5&category=Campus%20Apparel&supplier=Campus%20Tech%20Supply&search=hoodie&sort=price&order=asc
export async function getProducts(req, res, next) {
  try {
    const page = parsePositiveInteger(req.query.page, 1);
    const limit = Math.min(parsePositiveInteger(req.query.limit, 10), 100);
    const sortField = SORT_FIELDS.includes(req.query.sort) ? req.query.sort : 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    const filter = {};

    // An unknown category or supplier matches nothing instead of being ignored
    const noMatch = new mongoose.Types.ObjectId();
    if (req.query.category) filter.category = (await findReferenceId(Category, req.query.category)) ?? noMatch;
    if (req.query.supplier) filter.supplier = (await findReferenceId(Supplier, req.query.supplier)) ?? noMatch;
    if (req.query.search) filter.$text = { $search: String(req.query.search) };
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    const [products, total] = await Promise.all([
      Product.find(filter).populate(POPULATE).sort({ [sortField]: order, _id: 1 }).skip((page - 1) * limit).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Products retrieved successfully.',
      count: total,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

// GET /:id
export async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate(POPULATE);
    if (!product) throw new HttpError(HttpStatus.NOT_FOUND, 'Product not found.');
    res.status(HttpStatus.OK).json({ success: true, message: 'Product retrieved successfully.', data: product });
  } catch (error) {
    next(error);
  }
}

// POST / — Admin. JSON or multipart/form-data with an optional "image" file
export async function createProduct(req, res, next) {
  let uploaded;
  try {
    const input = parseProductInput(req.body);
    input.category = await resolveReference(Category, req.body.category, 'Category');
    input.supplier = await resolveReference(Supplier, req.body.supplier, 'Supplier', { optional: true });

    if (req.file) {
      uploaded = await uploadBufferToCloudinary(req.file.buffer);
      input.imageUrl = uploaded.secure_url;
      input.imagePublicId = uploaded.public_id;
    }

    const product = await Product.create(input);
    await product.populate(POPULATE);
    res.status(HttpStatus.CREATED).json({ success: true, message: 'Product created successfully.', data: product });
  } catch (error) {
    // Don't leave an orphaned image in Cloudinary if saving the product failed
    if (uploaded) await deleteCloudinaryImage(uploaded.public_id);
    next(error);
  }
}

// PUT /:id — Admin. Replacing the image deletes the old one from Cloudinary
export async function updateProduct(req, res, next) {
  let uploaded;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new HttpError(HttpStatus.NOT_FOUND, 'Product not found.');

    const updates = parseProductInput(req.body);
    updates.category = await resolveReference(Category, req.body.category, 'Category');
    updates.supplier = await resolveReference(Supplier, req.body.supplier, 'Supplier', { optional: true });

    const previousPublicId = product.imagePublicId;
    let replaceImage = false;

    if (req.file) {
      uploaded = await uploadBufferToCloudinary(req.file.buffer);
      updates.imageUrl = uploaded.secure_url;
      updates.imagePublicId = uploaded.public_id;
      replaceImage = true;
    } else if (updates.imageUrl !== undefined && updates.imageUrl !== product.imageUrl) {
      // Switched to an external image URL: the old Cloudinary image is no longer used
      updates.imagePublicId = undefined;
      replaceImage = true;
    }

    for (const [field, value] of Object.entries(updates)) {
      if (value !== undefined || (field === 'imagePublicId' && replaceImage)) product[field] = value;
    }
    await product.save();

    if (replaceImage && previousPublicId) await deleteCloudinaryImage(previousPublicId);
    await product.populate(POPULATE);
    res.status(HttpStatus.OK).json({ success: true, message: 'Product updated successfully.', data: product });
  } catch (error) {
    if (uploaded) await deleteCloudinaryImage(uploaded.public_id);
    next(error);
  }
}

// POST /:id/upload-image — Admin. Uploads (or replaces) only the image
export async function uploadProductImage(req, res, next) {
  let uploaded;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new HttpError(HttpStatus.NOT_FOUND, 'Product not found.');
    if (!req.file) throw new HttpError(HttpStatus.BAD_REQUEST, 'Image file is required.');

    const previousPublicId = product.imagePublicId;
    uploaded = await uploadBufferToCloudinary(req.file.buffer);
    product.imageUrl = uploaded.secure_url;
    product.imagePublicId = uploaded.public_id;
    await product.save();
    await deleteCloudinaryImage(previousPublicId);

    await product.populate(POPULATE);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Product image uploaded successfully.',
      imageUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
      data: product,
    });
  } catch (error) {
    if (uploaded) await deleteCloudinaryImage(uploaded.public_id);
    next(error);
  }
}

// DELETE /:id/image — Admin. Removes the image from the product and from Cloudinary
export async function deleteProductImage(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new HttpError(HttpStatus.NOT_FOUND, 'Product not found.');
    if (!product.imageUrl) throw new HttpError(HttpStatus.BAD_REQUEST, 'This product has no image.');

    await deleteCloudinaryImage(product.imagePublicId);
    product.imageUrl = undefined;
    product.imagePublicId = undefined;
    await product.save();

    await product.populate(POPULATE);
    res.status(HttpStatus.OK).json({ success: true, message: 'Product image removed successfully.', data: product });
  } catch (error) {
    next(error);
  }
}

// DELETE /:id — Admin. Also deletes the product's image from Cloudinary
export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new HttpError(HttpStatus.NOT_FOUND, 'Product not found.');
    await deleteCloudinaryImage(product.imagePublicId);
    res.status(HttpStatus.OK).json({ success: true, message: 'Product deleted successfully.', data: null });
  } catch (error) {
    next(error);
  }
}
