<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
    <div class="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img src="../assets/logo.png" alt="Logo" style="width:200px;" />
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
      <p class="text-center text-gray-500 text-sm mb-6">Register to get started</p>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-5">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            v-model="name"
            required
            class="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div class="relative">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              required
              class="w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <span v-if="showConfirmPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2.5 rounded-xl shadow-md hover:bg-indigo-700 transition font-medium"
        >
          Register
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
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleRegister = async () => {
  try {
    if (password.value !== confirmPassword.value) {
      alert("Password tidak sama!");
      return;
    }

    const res = await axios.post("http://localhost:5000/api/auth/register", {
      name: name.value,
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("token", res.data.token);
    router.push("/dashboard");
  } catch (err) {
    alert(err.response?.data?.error || "Register gagal");
  }
};
</script>
