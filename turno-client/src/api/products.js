import api from './api.js';
export const getProducts = (params) => api.get('/product', { params });
export const getProduct = (id) => api.get(`/product/${id}`);
export const createProduct = (data) => api.post('/product', data);
export const updateProduct = (id, data) => api.put(`/product/${id}`, data);
export const deleteProduct = (id) => api.delete(`/product/${id}`);
export const getCategories = () => api.get('/category');
