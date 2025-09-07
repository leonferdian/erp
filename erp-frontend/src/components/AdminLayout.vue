<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/dashboard" class="text-xl font-bold text-gray-900">ERP System</router-link>
            <span class="ml-4 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
              Admin
            </span>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="relative p-2 text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V1H4v4zM15 7h5l-5-5v5z"></path>
              </svg>
              <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ notificationCount }}
              </span>
            </button>
            
            <!-- User Menu -->
            <div class="relative">
              <button @click="showDropdown = !showDropdown" class="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <img class="h-8 w-8 rounded-full" :src="user?.avatar || defaultAvatar" alt="User avatar">
                <span class="text-gray-700">{{ user?.name || 'Admin' }}</span>
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</router-link>
                <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</router-link>
                <router-link to="/admin/notifications" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notifications</router-link>
                <a @click="logout" href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex">
      <!-- Sidebar -->
      <div class="hidden md:flex md:w-64 md:flex-col">
        <div class="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
          <div class="flex flex-col flex-grow">
            <nav class="flex-1 px-2 pb-4 space-y-1">
              <!-- Dashboard -->
              <router-link
                to="/admin/dashboard"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="$route.name === 'AdminDashboard' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              >
                <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
                </svg>
                Dashboard
              </router-link>

              <!-- Users -->
              <router-link
                to="/admin/users"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="$route.name === 'AdminUsers' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              >
                <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                Users
              </router-link>

              <!-- Products -->
              <router-link
                to="/admin/products"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="$route.name === 'AdminProducts' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              >
                <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                Products
              </router-link>

              <!-- Inventory -->
              <router-link
                to="/admin/inventory"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="$route.name === 'AdminInventory' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              >
                <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H19a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
                Inventory
              </router-link>

              <!-- Orders -->
              <router-link
                to="/admin/orders"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="$route.name === 'AdminOrders' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              >
                <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Orders
              </router-link>

              <!-- Financial -->
              <router-link
                to="/admin/financial"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="$route.name === 'AdminFinancial' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              >
                <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                Financial
              </router-link>

              <!-- Analytics -->
              <router-link
                to="/admin/analytics"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="$route.name === 'AdminAnalytics' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              >
                <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Analytics
              </router-link>

              <!-- Reports -->
              <router-link
                to="/admin/reports"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="$route.name === 'AdminReports' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              >
                <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Reports
              </router-link>

              <!-- Notifications -->
              <router-link
                to="/admin/notifications"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="$route.name === 'AdminNotifications' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              >
                <svg class="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V1H4v4zM15 7h5l-5-5v5z"></path>
                </svg>
                Notifications
                <span v-if="notificationCount > 0" class="ml-auto bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {{ notificationCount }}
                </span>
              </router-link>
            </nav>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <main class="flex-1 relative overflow-y-auto focus:outline-none">
          <div class="py-6">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <!-- Page Header -->
              <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
                <p v-if="pageDescription" class="mt-1 text-sm text-gray-500">{{ pageDescription }}</p>
              </div>

              <!-- Page Content -->
              <slot />
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { user, logout: authLogout } = useAuth();

// Props
defineProps<{
  pageTitle: string;
  pageDescription?: string;
}>();

// State
const showDropdown = ref(false);
const notificationCount = ref(3); // Mock notification count

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

// Methods
const logout = () => {
  authLogout();
  router.push('/login');
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
