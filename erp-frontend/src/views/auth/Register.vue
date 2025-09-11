<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
    <div class="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
          <span class="text-white text-2xl font-bold">E</span>
        </div>
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
      <p class="text-center text-gray-500 text-sm mb-6">Register to get started</p>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
        {{ successMessage }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-5">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            v-model="name"
            required
            :disabled="isLoading"
            class="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter your name"
          />
        </div>

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

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div class="relative">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              required
              :disabled="isLoading"
              class="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              :disabled="isLoading"
              class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
            >
              <span v-if="showConfirmPassword">🙈</span>
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
          {{ isLoading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>

      <!-- Login link -->
      <p class="text-center text-gray-500 text-sm mt-6">
        Sudah punya akun?
        <router-link to="/login" class="text-indigo-600 font-medium hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../../composables/useAuth";

const router = useRouter();
const { register, isLoading, error, clearError } = useAuth();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const successMessage = ref("");

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleRegister = async () => {
  clearError();
  successMessage.value = "";
  
  if (password.value !== confirmPassword.value) {
    error.value = "Password tidak sama!";
    return;
  }

  const result = await register({
    name: name.value,
    email: email.value,
    password: password.value,
  });

  if (result.success) {
    successMessage.value = "Account created successfully! Redirecting to login...";
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } else {
    console.error("Registration failed:", result.error);
  }
};
</script>
