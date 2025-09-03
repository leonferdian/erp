import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
// import Login from "../views/Login.vue";
// import Dashboard from "../views/Dashboard.vue";

// const routes = [
//   { path: "/login", name: "Login", component: Login },
//   { path: "/", redirect: "/login" },
//   { path: "/dashboard", component: Dashboard }
// ];

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
   {
    path: "/dashboard",
    name: "Home",
    component: () => import("../views/Dashboard.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
