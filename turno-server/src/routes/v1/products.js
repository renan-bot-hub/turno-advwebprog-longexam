import { Router } from 'express';
import Product from '../../models/Product.js';
import { HttpStatus } from '../../config/constants.js';

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
    supplier: body.supplier,
    price: body.price,
    stock: body.stock,
    description: body.description,
    imageUrl: body.imageUrl,
  };
}

// GET /api/v1/product
// Supports: ?page=1&limit=5&category=Uniform&supplier=Nike&sort=price&order=asc&search=jacket&minPrice=100&maxPrice=500
router.get('/', async (req, res, next) => {
  try {
    const page = parsePositiveInteger(req.query.page, 1);
    const limit = Math.min(parsePositiveInteger(req.query.limit, 10), 100);

    const allowedSortFields = ['name', 'title', 'category', 'price', 'stock', 'createdAt'];
    const sortField = allowedSortFields.includes(req.query.sort) ? req.query.sort : 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    // Build filter — supports multiple query parameters simultaneously
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.supplier) filter.supplier = req.query.supplier;
    if (req.query.search) filter.$text = { $search: req.query.search };
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ [sortField]: order })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Products retrieved successfully.',
      count: total,
      pagination: { page, limit, pages: Math.ceil(total / limit) },
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/product/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Product not found.',
        data: null,
      });
    }
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Product retrieved successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/product
router.post('/', async (req, res, next) => {
  try {
    const product = await Product.create(parseProductInput(req.body));
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Product created successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/product/:id
router.put('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      parseProductInput(req.body),
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Product not found.',
        data: null,
      });
    }
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Product updated successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/product/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Product not found.',
        data: null,
      });
    }
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
});

export default router;
