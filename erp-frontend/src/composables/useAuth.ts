import { ref, computed } from 'vue';
import { authService } from '../services/authService.js';

// Global state
const user = ref<any>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Initialize user from localStorage
const initAuth = () => {
  const savedUser = authService.getCurrentUser();
  if (savedUser && authService.isAuthenticated()) {
    user.value = savedUser;
  }
};

// Initialize on module load
initAuth();

export const useAuth = () => {
  const isAuthenticated = computed(() => {
    return user.value !== null && authService.isAuthenticated();
  });

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        user.value = result.data;
        return { success: true };
      } else {
        error.value = result.error;
        return { success: false, error: result.error };
      }
    } catch (err) {
      error.value = 'An unexpected error occurred';
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (userData: any) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        error.value = result.error;
        return { success: false, error: result.error };
      }
    } catch (err) {
      error.value = 'An unexpected error occurred';
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    authService.logout();
    user.value = null;
    error.value = null;
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    clearError,
    
    // Utils
    getToken: authService.getToken,
    refreshToken: authService.refreshToken
  };
};
