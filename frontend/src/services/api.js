import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

export const getSources = (params) => api.get('/sources', { params });
export const getSource = (id) => api.get(`/sources/${id}`);
export const createSource = (data) => api.post('/sources', data);
export const updateSource = (id, data) => api.put(`/sources/${id}`, data);
export const deleteSource = (id) => api.delete(`/sources/${id}`);
export const understandSource = (id) => api.post(`/sources/${id}/understand`);

export default api;
