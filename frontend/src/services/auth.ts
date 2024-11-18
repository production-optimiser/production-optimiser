import axios from 'axios';
import { User } from '../types/auth';

const API_URL = 'http://localhost:8080/api';

export const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin1',
    password: 'password123',
  },
  customer: {
    email: 'customer1',
    password: 'password123',
  },
};

// Helper function to validate demo credentials
const isDemoCredential = (
  email: string,
  password: string
): { role: string } | null => {
  if (
    email === DEMO_CREDENTIALS.admin.email &&
    password === DEMO_CREDENTIALS.admin.password
  ) {
    return { role: 'ADMIN' };
  }
  if (
    email === DEMO_CREDENTIALS.customer.email &&
    password === DEMO_CREDENTIALS.customer.password
  ) {
    return { role: 'CUSTOMER' };
  }
  return null;
};

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const demoRole = isDemoCredential(email, password);

    if (demoRole) {
      console.log(
        `Logging in with demo credentials for role: ${demoRole.role}`
      );
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: email === DEMO_CREDENTIALS.admin.email ? '1' : '2',
            email,
            roles: [demoRole.role],
          });
        }, 500); // Simulate API delay
      });
    }

    try {
      console.log(`Attempting API login for: ${email}`);
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      return {
        id: response.data.id,
        email: response.data.email,
        roles: [response.data.role],
      };
    } catch (error) {
      console.error('API login error:', error);
      throw new Error('Invalid credentials');
    }
  },

  logout() {
    localStorage.removeItem('token');
  },
};
