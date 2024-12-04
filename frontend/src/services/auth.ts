import { AxiosError } from 'axios';
import axiosInstance, { handleApiError } from '../utils/axios';
import { User, Role } from '../types/auth';
import { jwtDecode } from 'jwt-decode';

interface AuthenticationResponseDTO {
  token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

// Interface for decoded JWT token
interface DecodedToken {
  sub: string; // subject (email)
  roles: string[]; // user roles
  iss: string; // issuer
  exp: number; // expiration time
  iat: number; // issued at time
}

// Map email to roles
// const EMAIL_ROLE_MAP: Record<string, Role> = {
//   'admin1': 'ADMIN',
//   'customer1': 'CUSTOMER',
// };

export const authService = {
  // async login(email: string, password: string): Promise<User> {
  //   try {
  //     console.log('Attempting login with:', { email, password });

  //     const response = await axiosInstance.post<AuthenticationResponseDTO>('/auth/login', {
  //       email,
  //       password,
  //     } as LoginRequest);

  //     const { token } = response.data;
  //     console.log('Login successful, received token:', token);

  //     if (token) {
  //       localStorage.setItem('token', token);
  //       localStorage.setItem('userEmail', email);

  //       const role: Role = EMAIL_ROLE_MAP[email] || 'CUSTOMER';

  //       return {
  //         id: email,
  //         email: email,
  //         roles: [role],
  //       };
  //     }

  //     throw new Error('No token received');
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     const apiError = handleApiError(error as AxiosError);
  //     throw new Error(apiError.message || 'Invalid credentials');
  //   }
  // },
  async login(email: string, password: string): Promise<User> {
    try {
      console.log('Attempting login with:', { email, password });
  
      const response = await axiosInstance.post<AuthenticationResponseDTO>('/auth/login', {
        email,
        password,
      } as LoginRequest);
  
      const { token } = response.data;
      console.log('Login successful, received token:', token);
  
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);
  
        // Decode the token to extract roles dynamically
        const decoded = jwtDecode<DecodedToken>(token);
        const roles = decoded.roles.map(role => role.replace('ROLE_', '') as Role);
  
        console.log('Decoded roles:', roles);
  
        return {
          id: email,
          email: email,
          roles,
        };
      }
  
      throw new Error('No token received');
    } catch (error) {
      console.error('Login error:', error);
      const apiError = handleApiError(error as AxiosError);
      throw new Error(apiError.message || 'Invalid credentials');
    }
  },
  

  logout(): void {
    localStorage.removeItem('token');
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

  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return {
        id: decoded.sub,
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
