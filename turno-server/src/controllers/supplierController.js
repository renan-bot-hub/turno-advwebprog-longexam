import Supplier from '../models/supplierModel.js';
import Product from '../models/productModel.js';
import { HttpStatus } from '../config/constants.js';
import { HttpError } from '../middleware/errorHandlerMiddleware.js';

function supplierInput({ name, contactPerson, email, phone, address, isActive }) {
  return { name, contactPerson, email, phone, address, isActive };
}

// GET / — with the number of products from each supplier
export async function getSuppliers(req, res, next) {
  try {
    const [suppliers, counts] = await Promise.all([
      Supplier.find().sort({ name: 1 }).lean(),
      Product.aggregate([{ $match: { supplier: { $ne: null } } }, { $group: { _id: '$supplier', count: { $sum: 1 } } }]),
    ]);
    const countById = new Map(counts.map((c) => [String(c._id), c.count]));
    const data = suppliers.map((s) => ({ ...s, productCount: countById.get(String(s._id)) || 0 }));
    res.status(HttpStatus.OK).json({ success: true, message: 'Suppliers retrieved successfully.', count: data.length, data });
  } catch (error) {
    next(error);
  }
}

// GET /:id
export async function getSupplierById(req, res, next) {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) throw new HttpError(HttpStatus.NOT_FOUND, 'Supplier not found.');
    res.status(HttpStatus.OK).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
}

// POST / — Admin
export async function createSupplier(req, res, next) {
  try {
    const supplier = await Supplier.create(supplierInput(req.body));
    res.status(HttpStatus.CREATED).json({ success: true, message: 'Supplier created successfully.', data: supplier });
  } catch (error) {
    next(error);
  }
}

// PUT /:id — Admin
export async function updateSupplier(req, res, next) {
  try {
    const updates = Object.fromEntries(Object.entries(supplierInput(req.body)).filter(([, v]) => v !== undefined));
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!supplier) throw new HttpError(HttpStatus.NOT_FOUND, 'Supplier not found.');
    res.status(HttpStatus.OK).json({ success: true, message: 'Supplier updated successfully.', data: supplier });
  } catch (error) {
    next(error);
  }
}

// DELETE /:id — Admin. Blocked while products still reference the supplier
export async function deleteSupplier(req, res, next) {
  try {
    const inUse = await Product.countDocuments({ supplier: req.params.id });
    if (inUse > 0) {
      throw new HttpError(HttpStatus.CONFLICT, `This supplier is linked to ${inUse} product(s). Change those products first.`);
    }
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) throw new HttpError(HttpStatus.NOT_FOUND, 'Supplier not found.');
    res.status(HttpStatus.OK).json({ success: true, message: 'Supplier deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
