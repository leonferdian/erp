<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// const users = ref([]);
// const name = ref("");
// const email = ref("");
// const password = ref("");

// onMounted(async () => {
//   const res = await axios.get("http://localhost:5000/api/users");
//   users.value = res.data;
// });

// const addUser = async () => {
//   const res = await axios.post("http://localhost:5000/api/users", {
//     name: name.value,
//     email: email.value,
//     password: password.value
//   });
//   users.value.push(res.data);
//   name.value = "";
//   email.value = "";
//   password.value = "";
// };
</script>

<!-- <template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">ERP Frontend</h1>

    <form @submit.prevent="addUser" class="my-4">
      <input v-model="name" placeholder="Name" class="border p-2 m-1"/>
      <input v-model="email" placeholder="Email" class="border p-2 m-1"/>
      <input v-model="password" type="password" placeholder="Password" class="border p-2 m-1"/>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Add User</button>
    </form>

    <ul>
      <li v-for="u in users" :key="u._id">{{ u.name }} - {{ u.email }}</li>
    </ul>
  </div>
</template> -->

<template>
  <router-view />
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
