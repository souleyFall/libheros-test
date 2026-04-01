import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

// Ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// List API
export const listAPI = {
  getAll: () => api.get('/lists/me'),
  create: (data: { name: string }) => api.post('/lists', data),
  delete: (id: string) => api.delete(`/lists/${id}`),
};

// Task API
export const taskAPI = {
  getByList: (listId: string) => api.get(`/tasks/list/${listId}`),
  getAll: () => api.get('/tasks/me'),
  create: (data: { shortDescription: string; longDescription?: string; dueDate: string; listId: string }) =>
    api.post('/tasks', data),
  update: (id: string, data: { completed: boolean }) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};
