import api from './api.js';
export const getUsers = () => api.get('/user');
export const getUser = (id) => api.get(`/user/${id}`);
export const updateUser = (id, data) => api.put(`/user/${id}`, data);
export const deleteUser = (id) => api.delete(`/user/${id}`);