import api from './api.js';
export const getOrders = (params) => api.get('/order', { params });
export const getOrder = (id) => api.get(`/order/${id}`);
export const createOrder = (data) => api.post('/order', data);
export const updateOrderStatus = (id, data) => api.put(`/order/${id}`, data);
