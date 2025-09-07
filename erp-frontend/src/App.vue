<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { authService } from "./services/authService";
import NotificationCenter from "./components/NotificationCenter.vue";

const router = useRouter();
const route = useRoute();

const user = ref(null);
const isAuthenticated = computed(() => authService.isAuthenticated());
const showMobileMenu = ref(false);

onMounted(() => {
  user.value = authService.getCurrentUser();
});

const logout = () => {
  authService.logout();
  user.value = null;
  router.push("/login");
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

// Check if current route is auth route
const isAuthRoute = computed(() => {
  return route.path === "/login" || route.path === "/register";
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav v-if="!isAuthRoute" class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/dashboard" class="text-xl font-bold text-gray-900">
                ERP System
              </router-link>
            </div>

            <!-- Navigation Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/dashboard"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-indigo-500 text-gray-900"
              >
                Dashboard
              </router-link>
              
              <router-link
                to="/shop"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-indigo-500 text-gray-900"
              >
                Shop
              </router-link>
              
              <router-link
                to="/orders"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-indigo-500 text-gray-900"
              >
                Orders
              </router-link>

              <!-- Admin Links -->
              <template v-if="user?.role === 'admin'">
                <router-link
                  to="/admin/dashboard"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                >
                  Admin
                </router-link>
              </template>
            </div>
          </div>

          <!-- Right side -->
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <!-- Notifications -->
            <NotificationCenter class="mr-4" />

            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <div class="flex items-center space-x-4">
                <router-link
                  to="/profile"
                  class="text-gray-500 hover:text-gray-700"
                >
                  Profile
                </router-link>
                <router-link
                  to="/settings"
                  class="text-gray-500 hover:text-gray-700"
                >
                  Settings
                </router-link>
                <button
                  @click="logout"
                  class="text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="-mr-2 flex items-center sm:hidden">
            <button
              @click="toggleMobileMenu"
              class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span class="sr-only">Open main menu</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link
            to="/dashboard"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
            @click="showMobileMenu = false"
          >
            Dashboard
          </router-link>
          
          <router-link
            to="/shop"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
            @click="showMobileMenu = false"
          >
            Shop
          </router-link>
          
          <router-link
            to="/orders"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
            @click="showMobileMenu = false"
          >
            Orders
          </router-link>

          <template v-if="user?.role === 'admin'">
            <router-link
              to="/admin/dashboard"
              class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
              @click="showMobileMenu = false"
            >
              Admin
            </router-link>
          </template>
        </div>
        
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span class="text-sm font-medium text-gray-700">
                  {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
                </span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">
                {{ user?.firstName }} {{ user?.lastName }}
              </div>
              <div class="text-sm font-medium text-gray-500">
                {{ user?.email }}
              </div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <router-link
              to="/profile"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              @click="showMobileMenu = false"
            >
              Profile
            </router-link>
            <router-link
              to="/settings"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              @click="showMobileMenu = false"
            >
              Settings
            </router-link>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>
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
