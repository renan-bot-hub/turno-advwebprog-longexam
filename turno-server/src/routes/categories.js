import { Router } from 'express';
import Category from '../models/Category.js';
import { HttpStatus } from '../config/constants.js';

const router = Router();

// GET /api/category
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(HttpStatus.OK).json({ data: categories });
  } catch (error) {
    next(error);
  }
});

// GET /api/category/:id
router.get('/:id', async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Category not found' });
    res.status(HttpStatus.OK).json(category);
  } catch (error) {
    next(error);
  }
});

// POST /api/category
router.post('/', async (req, res, next) => {
  try {
    const { name, description, imageUrl, isActive } = req.body;
    const category = await Category.create({ name, description, imageUrl, isActive });
    res.status(HttpStatus.CREATED).json(category);
  } catch (error) {
    next(error);
  }
});

// PUT /api/category/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { name, description, imageUrl, isActive } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, imageUrl, isActive },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Category not found' });
    res.status(HttpStatus.OK).json(category);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/category/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Category not found' });
    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
});

export default router;
