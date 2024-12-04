import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Замените на ваш backend
});

// Добавление токена в заголовки
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/auth/register/', data);
export const loginUser = (data) => API.post('/auth/jwt/create/', data);
export const fetchTasks = () => API.get('/tasks/');
export const createTask = (data) => API.post('/tasks/', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}/`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}/`);
