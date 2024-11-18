import axios from 'axios';
import { User } from '../types/auth';

const API_URL = 'http://localhost:8080/api';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      return {
        id: response.data.id,
        email: response.data.email,
        roles: [response.data.role]
      };
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  },

  logout() {
    localStorage.removeItem('token');
  }
};