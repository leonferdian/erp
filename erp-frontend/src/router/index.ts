import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { authGuard, guestGuard } from "./guards";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    beforeEnter: guestGuard,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    beforeEnter: guestGuard,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    beforeEnter: authGuard,
  },
  // Catch all route - redirect to dashboard
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard
router.beforeEach((_to, _from, next) => {
  // Add any global logic here if needed
  next();
});

export default router;
