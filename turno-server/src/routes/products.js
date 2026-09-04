import { Router } from 'express';
import Product from '../models/Product.js';
import { HttpStatus } from '../config/constants.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseProductInput(body) {
  return {
    name: body.name,
    title: body.title,
    category: body.category,
    price: body.price,
    stock: body.stock,
    description: body.description,
    imageUrl: body.imageUrl,
  };
}

// GET /api/product — public
router.get('/', async (req, res, next) => {
  try {
    const page = parsePositiveInteger(req.query.page, 1);
    const limit = Math.min(parsePositiveInteger(req.query.limit, 10), 100);
    const sortField = ['name', 'title', 'category', 'price', 'stock', 'createdAt'].includes(req.query.sort)
      ? req.query.sort : 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.$text = { $search: req.query.search };
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ [sortField]: order }).skip((page - 1) * limit).limit(limit),
      Product.countDocuments(filter),
    ]);
    res.status(HttpStatus.OK).json({
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) { next(error); }
});

// GET /api/product/:id — public
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Product not found' });
    res.status(HttpStatus.OK).json({ data: product });
  } catch (error) { next(error); }
});

// POST /api/product — admin only
router.post('/', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const product = await Product.create(parseProductInput(req.body));
    res.status(HttpStatus.CREATED).json({ data: product });
  } catch (error) { next(error); }
});

// PUT /api/product/:id — admin only
router.put('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, parseProductInput(req.body), { new: true, runValidators: true });
    if (!product) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Product not found' });
    res.status(HttpStatus.OK).json({ data: product });
  } catch (error) { next(error); }
});

// DELETE /api/product/:id — admin only
router.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Product not found' });
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) { next(error); }
});

export default router;
