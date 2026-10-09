import api from './api.js';
export const getProducts = (params) => api.get('/product', { params });
export const getProduct = (id) => api.get(`/product/${id}`);
export const createProduct = (data) => api.post('/product', data, {
	headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateProduct = (id, data) => api.put(`/product/${id}`, data, {
	headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteProduct = (id) => api.delete(`/product/${id}`);
export const deleteProductImage = (id) => api.delete(`/product/${id}/image`);
export const getCategories = () => api.get('/category');
export const getSuppliers = () => api.get('/supplier');

// Products reference their category/supplier by ObjectId and the API returns them populated
// ({ _id, name }). Older cart entries may still hold a plain name, so accept both.
export const categoryName = (product) => (typeof product?.category === 'object' ? product.category?.name : product?.category) || '';
export const supplierName = (product) => (typeof product?.supplier === 'object' ? product.supplier?.name : product?.supplier) || '';
