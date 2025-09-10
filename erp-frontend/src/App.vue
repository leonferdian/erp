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
const showUserDropdown = ref(false);
const showNotifications = ref(false);

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

const closeDropdowns = () => {
  showUserDropdown.value = false;
  showNotifications.value = false;
};

// Check if current route is auth route
const isAuthRoute = computed(() => {
  return route.path === "/login" || route.path === "/register";
});
</script>

<template>
  <div class="min-h-screen bg-gray-50" @click="closeDropdowns">
    <!-- Navigation -->
    <nav v-if="!isAuthRoute" class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo - Hidden -->
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/dashboard" class="flex items-center group transition-all duration-300">
                <img 
                  src="./assets/image/G9lTrJxk_400x400.png" 
                  alt="Logo"
                  class="w-8 h-8 rounded-full object-cover transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(37,99,235,0.7)]"
                />
                <span class="ml-2 text-xl font-bold text-blue-900 group-hover:text-blue-700 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  Octopus
                </span>
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

              <!-- Admin Menu -->
              <template v-if="user?.role === 'admin'">
                <router-link
                  to="/admin/users"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                >
                  Users
                </router-link>
                <router-link
                  to="/admin/products"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                >
                  Products
                </router-link>
                <router-link
                  to="/admin/orders"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                >
                  Orders
                </router-link>
                <router-link
                  to="/admin/analytics"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                >
                  Analytics
                </router-link>
              </template>

              <!-- Customer Menu -->
              <template v-else>
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
                  My Orders
                </router-link>
                <router-link
                  to="/profile"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                >
                  Profile
                </router-link>
                <router-link
                  to="/admin/users"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                >
                  Users
                </router-link>
                <router-link
                  to="/admin/products"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                >
                  Products
                </router-link>
                <router-link
                  to="/admin/inventory"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                >
                  Inventory
                </router-link>
                <router-link
                  to="/admin/orders"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                >
                  Admin Orders
                </router-link>
                <router-link
                  to="/admin/analytics"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                >
                  Analytics
                </router-link>
                <router-link
                  to="/admin/notifications"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                >
                  Notifications
                </router-link>
              </template>
            </div>
          </div>

          <!-- Right side - Notifications and User Menu -->
          <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <!-- Notifications -->
            <div class="relative">
              <button 
                @click.stop="showNotifications = !showNotifications"
                class="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span class="sr-only">View notifications</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                <span class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
              
              <!-- Notifications Dropdown -->
              <div
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                @click.stop
              >
                <div class="px-4 py-2 border-b border-gray-100">
                  <h3 class="text-sm font-medium text-gray-900">Notifications</h3>
                </div>
                <div class="max-h-64 overflow-y-auto">
                  <div class="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <div class="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <div class="ml-3 flex-1">
                        <p class="text-sm font-medium text-gray-900">Order Completed</p>
                        <p class="text-sm text-gray-500">Order #1245 has been successfully delivered</p>
                        <p class="text-xs text-gray-400 mt-1">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div class="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <div class="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <svg class="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
                          </svg>
                        </div>
                      </div>
                      <div class="ml-3 flex-1">
                        <p class="text-sm font-medium text-gray-900">Low Stock Alert</p>
                        <p class="text-sm text-gray-500">Wireless Headphones running low on stock</p>
                        <p class="text-xs text-gray-400 mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div class="px-4 py-3 hover:bg-gray-50">
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                      </div>
                      <div class="ml-3 flex-1">
                        <p class="text-sm font-medium text-gray-900">System Maintenance</p>
                        <p class="text-sm text-gray-500">Scheduled maintenance tonight from 2-4 AM</p>
                        <p class="text-xs text-gray-400 mt-1">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="px-4 py-2 border-t border-gray-100">
                  <router-link 
                    to="/admin/notifications" 
                    class="text-sm text-indigo-600 hover:text-indigo-500"
                    @click="showNotifications = false"
                  >
                    View all notifications
                  </router-link>
                </div>
              </div>
            </div>

            <div class="relative" v-if="user">
              <button
                @click.stop="showUserDropdown = !showUserDropdown"
                class="flex items-center space-x-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                <div class="h-8 w-8 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center">
                  <img 
                    v-if="user?.avatar" 
                    :src="user.avatar" 
                    :alt="user.firstName"
                    class="h-full w-full object-cover"
                  />
                  <span v-else class="text-sm font-medium text-white">
                    {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
                  </span>
                </div>
                <span class="text-sm font-medium">{{ user?.firstName }}</span>
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Dropdown menu -->
              <div
                v-if="showUserDropdown"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                @click.stop
              >
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900">{{ user?.firstName }} {{ user?.lastName }}</p>
                  <p class="text-sm text-gray-500 truncate">{{ user?.email }}</p>
                </div>
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserDropdown = false"
                >
                  Profile
                </router-link>
                <router-link
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserDropdown = false"
                >
                  Settings
                </router-link>
                <div class="border-t border-gray-100 my-1"></div>
                <router-link
                  v-if="user.role === 'admin'"
                  to="/admin"
                  class="block px-4 py-2 text-sm text-indigo-600 hover:bg-gray-100"
                  @click="showUserDropdown = false"
                >
                  Admin Dashboard
                </router-link>
                <div class="border-t border-gray-100 my-1"></div>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign out
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

          <!-- Admin Mobile Menu -->
          <template v-if="user?.role === 'admin'">
            <router-link
              to="/admin/users"
              class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
              @click="showMobileMenu = false"
            >
              Users
            </router-link>
            <router-link
              to="/admin/products"
              class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
              @click="showMobileMenu = false"
            >
              Products
            </router-link>
            <router-link
              to="/admin/orders"
              class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
              @click="showMobileMenu = false"
            >
              Orders
            </router-link>
            <router-link
              to="/admin/analytics"
              class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
              @click="showMobileMenu = false"
            >
              Analytics
            </router-link>
          </template>

          <!-- Customer Mobile Menu -->
          <template v-else>
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
              My Orders
            </router-link>
            <router-link
              to="/profile"
              class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
              @click="showMobileMenu = false"
            >
              Profile
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
