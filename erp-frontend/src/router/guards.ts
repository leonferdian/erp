import { authService } from '../services/authService.js';

export const authGuard = (_to: any, _from: any, next: any) => {
  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    next();
  } else {
    // Redirect to login page
    next('/login');
  }
};

export const guestGuard = (_to: any, _from: any, next: any) => {
  // Check if user is already authenticated
  if (authService.isAuthenticated()) {
    // Redirect to dashboard if already logged in
    next('/dashboard');
  } else {
    next();
  }
};

export const adminGuard = (_to: any, _from: any, next: any) => {
  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    next('/login');
    return;
  }
  
  // Check if user is admin
  const user = authService.getCurrentUser();
  if (user && user.role === 'admin') {
    next();
  } else {
    // Redirect to dashboard if not admin
    next('/dashboard');
  }
};

export const customerGuard = (_to: any, _from: any, next: any) => {
  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    next('/login');
    return;
  }
  
  // Check if user is customer
  const user = authService.getCurrentUser();
  if (user && (user.role === 'customer' || user.role === 'user')) {
    next();
  } else {
    // Redirect to admin dashboard if admin
    next('/admin/dashboard');
  }
};