import axios from 'axios';
import { config } from '../config/env';
import { getDemoUser } from '../data/demoUsers';

const API_URL = config.API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken: refreshToken
          });
          
          const { token } = response.data;
          localStorage.setItem('token', token);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  // Login user
  async login(email: string, password: string) {
    console.log('AuthService.login called with:', { email, password });
    
    try {
      // Check demo users first
      console.log('Checking demo users...');
      const demoUser = getDemoUser(email, password);
      console.log('Demo user found:', demoUser);
      
      if (demoUser) {
        const mockToken = 'demo_token_' + Date.now();
        const userData = {
          id: demoUser.email,
          email: demoUser.email,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          role: demoUser.role,
          avatar: null
        };
        
        console.log('Storing demo user data:', userData);
        
        // Store tokens and user data
        localStorage.setItem('token', mockToken);
        localStorage.setItem('refreshToken', 'demo_refresh_token');
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Demo login successful');
        return { success: true, data: { token: mockToken, user: userData } };
      }

      // Try backend API if demo user not found
      console.log('Demo user not found, trying backend API...');
      const response = await api.post('/auth/login', { email, password });
      const { token, refreshToken, ...userData } = response.data;
      
      // Store tokens and user data
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('Backend login successful');
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  },

  // Register user
  async register(userData: any) {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Handle demo tokens
    if (token.startsWith('demo_token_')) {
      return true;
    }
    
    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  // Get token
  getToken() {
    return localStorage.getItem('token');
  },

  // Set token
  setToken(token: string) {
    localStorage.setItem('token', token);
  },

  // Set user
  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');
      
      const response = await api.post('/auth/refresh', { refreshToken });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      return { success: true, token };
    } catch (error: any) {
      this.logout();
      return { success: false, error: error.message };
    }
  }
};

export default api;

