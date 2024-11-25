/*import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;*/ 

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';


const API_URL = 'http://localhost:8080/api';

export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.config?.url === '/login') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    if (error.response?.status === 403) {
      if (!window.location.pathname.includes('/unauthorized')) {
        window.location.href = '/unauthorized';
      }
    }

    return Promise.reject(error);
  }
);

export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || 'An error occurred',
      data: error.response.data
    };
  }
  
  if (error.request) {
    return {
      status: 0,
      message: 'No response from server. Please check your connection.',
      data: null
    };
  }
  
  return {
    status: 0,
    message: error.message || 'Request failed',
    data: null
  };
};

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export default instance;
