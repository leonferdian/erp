import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { authGuard, guestGuard, adminGuard } from "./guards";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  
  // Authentication Routes
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/auth/Register.vue"),
    beforeEnter: guestGuard,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/auth/Login.vue"),
    beforeEnter: guestGuard,
  },
  
  // Main Dashboard
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    beforeEnter: authGuard,
  },
  
  // Profile & Settings
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/user/Profile.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/user/Settings.vue"),
    beforeEnter: authGuard,
  },
  
  // Customer Shopping Routes
  {
    path: "/shop",
    name: "Shop",
    component: () => import("../views/customer/Shop.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/products/:id",
    name: "ProductDetail",
    component: () => import("../views/customer/ProductDetail.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../views/customer/Cart.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: () => import("../views/customer/Checkout.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/orders",
    name: "Orders",
    component: () => import("../views/customer/Orders.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/orders/:id",
    name: "OrderDetail",
    component: () => import("../views/customer/OrderDetail.vue"),
    beforeEnter: authGuard,
  },
  
  // Admin Management Routes
  {
    path: "/admin",
    redirect: "/admin/dashboard",
  },
  {
    path: "/admin/dashboard",
    name: "AdminDashboard",
    component: () => import("../views/admin/Dashboard.vue"),
    beforeEnter: adminGuard,
  },
  {
    path: "/admin/users",
    name: "AdminUsers",
    component: () => import("../views/admin/Users.vue"),
    beforeEnter: adminGuard,
  },
  {
    path: "/admin/products",
    name: "AdminProducts",
    component: () => import("../views/admin/Products.vue"),
    beforeEnter: adminGuard,
  },
  {
    path: "/admin/inventory",
    name: "AdminInventory",
    component: () => import("../views/admin/Inventory.vue"),
    beforeEnter: adminGuard,
  },
  {
    path: "/admin/orders",
    name: "AdminOrders",
    component: () => import("../views/admin/Orders.vue"),
    beforeEnter: adminGuard,
  },
  {
    path: "/admin/financial",
    name: "AdminFinancial",
    component: () => import("../views/admin/Financial.vue"),
    beforeEnter: adminGuard,
  },
  {
    path: "/admin/analytics",
    name: "AdminAnalytics",
    component: () => import("../views/admin/Analytics.vue"),
    beforeEnter: adminGuard,
  },
  {
    path: "/admin/reports",
    name: "AdminReports",
    component: () => import("../views/admin/Reports.vue"),
    beforeEnter: adminGuard,
  },
  {
    path: "/admin/notifications",
    name: "AdminNotifications",
    component: () => import("../views/admin/Notifications.vue"),
    beforeEnter: adminGuard,
  },
  
  // Payment Routes
  {
    path: "/payment",
    name: "Payment",
    component: () => import("../views/payment/Payment.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/payment/history",
    name: "PaymentHistory",
    component: () => import("../views/payment/PaymentHistory.vue"),
    beforeEnter: authGuard,
  },
  
  // Delivery Routes
  {
    path: "/delivery",
    name: "Delivery",
    component: () => import("../views/delivery/Delivery.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/delivery/track/:id",
    name: "DeliveryTrack",
    component: () => import("../views/delivery/DeliveryTrack.vue"),
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
