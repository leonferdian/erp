<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
    <div class="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img src="../assets/logo.png" alt="Logo" style="width:200px;" />
      </div>


      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
      <p class="text-center text-gray-500 text-sm mb-6">Login to continue</p>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            v-model="email"
            required
            :disabled="isLoading"
            class="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter your email"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              :disabled="isLoading"
              class="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter your password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              :disabled="isLoading"
              class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
            >
              <span v-if="showPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-indigo-600 text-white py-2.5 rounded-xl shadow-md hover:bg-indigo-700 transition font-medium disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span v-if="isLoading" class="mr-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <!-- Register link -->
      <p class="text-center text-gray-500 text-sm mt-6">
        Belum punya akun?
        <router-link to="/register" class="text-indigo-600 font-medium hover:underline">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { login, isLoading, error, clearError } = useAuth();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const handleLogin = async () => {
  clearError();
  
  const result = await login(email.value, password.value);
  
  if (result.success) {
    router.push("/dashboard");
  } else {
    // Error will be displayed via the error state
    console.error("Login failed:", result.error);
  }
};
</script>
