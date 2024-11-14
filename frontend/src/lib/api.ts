import axios from 'axios';

const API_URL = 'https://carlistkaro.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
};

export const cars = {
  create: (formData: FormData) => 
    api.post('/cars', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  list: (search?: string) => 
    api.get('/cars', { params: { search } }),
  get: (id: string) => 
    api.get(`/cars/${id}`),
  update: (id: string, formData: FormData) => 
    api.put(`/cars/${id}`, formData),
  delete: (id: string) => 
    api.delete(`/cars/${id}`)
};

export default api; 