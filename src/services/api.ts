
import axios from 'axios';

// Base URL for our API
const API_URL = 'https://digital-marketplace-api.onrender.com/api';

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Product services
export interface Product {
  _id?: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  fileUrl: string;
  creator?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const productAPI = {
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getUserProducts: async () => {
    const response = await api.get('/products/user');
    return response.data;
  },

  getUserStoreProducts: async (userId: string) => {
    const response = await api.get(`/products/user/${userId}`);
    return response.data;
  },

  createProduct: async (productData: FormData) => {
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id: string, productData: FormData) => {
    const response = await api.put(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

// User services
export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  storeName?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const userAPI = {
  getUserProfile: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateUserProfile: async (userData: FormData) => {
    const response = await api.put('/users/profile', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
