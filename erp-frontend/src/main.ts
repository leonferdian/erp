import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

// Initialize Grafana Faro for performance monitoring (must be before app creation)
import { initializeGrafana } from "./config/grafana";
initializeGrafana();

// Tambahkan interceptor sekali di sini
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

import "./assets/style.css";

const app = createApp(App);
app.use(router);
app.mount("#app");
