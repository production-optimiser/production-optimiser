import { AxiosError } from 'axios';
import axiosInstance, { handleApiError } from '../utils/axios';
import { User, Role } from '../types/auth';
import { jwtDecode } from 'jwt-decode';

interface AuthenticationResponseDTO {
  token: string;
  userId: string;  
}

interface LoginRequest {
  email: string;
  password: string;
}

interface DecodedToken {
  sub: string;
  roles: string[];
  iss: string;
  exp: number;
  iat: number;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      console.log('Attempting login with:', { email, password });
  
      const response = await axiosInstance.post<AuthenticationResponseDTO>('/auth/login', {
        email,
        password,
      } as LoginRequest);
  
      const { token, userId } = response.data;
      console.log('Login successful, received token:', token);
  
      if (token && userId) {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', userId);  // Store userId
  
        const decoded = jwtDecode<DecodedToken>(token);
        const roles = decoded.roles.map(role => role.replace('ROLE_', '') as Role);
  
        console.log('Decoded roles:', roles);
  
        return {
          id: userId,  
          email: email,
          roles,
        };
      }
  
      throw new Error('No token or userId received');
    } catch (error) {
      console.error('Login error:', error);
      const apiError = handleApiError(error as AxiosError);
      throw new Error(apiError.message || 'Invalid credentials');
    }
  },
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');  
    localStorage.removeItem('userEmail');
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUserId(): string | null {  
    return localStorage.getItem('userId');
  },

  getCurrentUser(): User | null {
    const token = this.getToken();
    const userId = this.getUserId();
    if (!token || !userId) return null;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return {
        id: userId,  
        email: decoded.sub,
        roles: decoded.roles.map(role => role.replace('ROLE_', '') as Role),
      };
    } catch {
      return null;
    }
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.roles.includes('ADMIN') || false;
  },

  isCustomer(): boolean {
    const user = this.getCurrentUser();
    return user?.roles.includes('CUSTOMER') || false;
  }
};
