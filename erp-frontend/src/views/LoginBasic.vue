<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Login</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <input v-model="email" type="email" placeholder="Email" class="border p-2 w-full"/>
      </div>
      <div>
        <input v-model="password" type="password" placeholder="Password" class="border p-2 w-full"/>
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email: email.value,
      password: password.value
    });
    console.log("Login success:", res.data);
    localStorage.setItem("token", res.data.token); // simpan token
    alert("Login berhasil!");
  } catch (err) {
    console.error(err);
    alert("Login gagal");
  }
};
</script>
