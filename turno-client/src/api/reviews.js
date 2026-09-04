import api from './api.js';
export const getReviews = (params) => api.get('/review', { params });
export const createReview = (data) => api.post('/review', data);
export const updateReview = (id, data) => api.put(`/review/${id}`, data);
export const deleteReview = (id) => api.delete(`/review/${id}`);
