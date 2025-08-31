import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/", redirect: "/login" },
  { path: "/dashboard", component: Dashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
