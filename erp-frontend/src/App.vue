<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const message = ref("");

onMounted(async () => {
  const res = await axios.get("http://localhost:5000");
  message.value = res.data.message;
});

const users = ref([]);

onMounted(async () => {
  const res = await axios.get("http://localhost:5000/api/users");
  users.value = res.data;
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">ERP Frontend</h1>
    <p>Backend says: {{ message }}</p>
    
    <h2>User List</h2>
    <ul>
      <li v-for="u in users" :key="u.id">{{ u.name }}</li>
    </ul>
  </div>
</template>

<style scoped>
/* .logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
} */
</style>
