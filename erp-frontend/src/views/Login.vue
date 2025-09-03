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

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            v-model="email"
            required
            class="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
              class="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <span v-if="showPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2.5 rounded-xl shadow-md hover:bg-indigo-700 transition font-medium"
        >
          Login
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
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const showPassword = ref(false);

const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("token", res.data.token);
    router.push("/dashboard");
  } catch (err) {
    alert(err.response?.data?.error || "Login gagal");
  }
};
</script>
