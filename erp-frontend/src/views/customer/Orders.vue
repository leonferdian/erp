<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/dashboard" class="hidden">ERP System</router-link>
          </div>
          <div class="flex items-center space-x-4">
            <!-- User Menu -->
            <div class="relative hidden">
              <button @click="showDropdown = !showDropdown" class="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <img class="h-8 w-8 rounded-full" :src="user?.avatar || defaultAvatar" alt="User avatar">
                <span class="text-gray-700">{{ user?.name || 'User' }}</span>
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</router-link>
                <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</router-link>
                <router-link to="/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</router-link>
                <a @click="logout" href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-6" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Dashboard
            </router-link>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">My Orders</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">My Orders</h1>
              <p class="mt-1 text-sm text-gray-500">Track and manage your orders</p>
            </div>
            <router-link
              to="/shop"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              Continue Shopping
            </router-link>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-gray-700">Filter by status:</label>
              <select
                v-model="statusFilter"
                class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                v-model="sortBy"
                class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="total">Total Amount</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div v-if="filteredOrders.length > 0" class="space-y-6">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-white shadow rounded-lg overflow-hidden"
        >
          <!-- Order Header -->
          <div class="px-4 py-5 sm:p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Order #{{ order.orderNumber }}</h3>
                  <p class="text-sm text-gray-500">Placed on {{ formatDate(order.orderDate) }}</p>
                </div>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(order.status)"
                >
                  {{ getStatusText(order.status) }}
                </span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <p class="text-lg font-semibold text-gray-900">${{ order.total.toFixed(2) }}</p>
                  <p class="text-sm text-gray-500">{{ order.items.length }} item(s)</p>
                </div>
                <router-link
                  :to="{ name: 'OrderDetail', params: { id: order.id } }"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="px-4 py-5 sm:p-6">
            <div class="space-y-4">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center space-x-4"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="h-16 w-16 object-cover rounded-md"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h4>
                  <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-500">
                  Tracking: {{ order.trackingNumber || 'Not available' }}
                </span>
                <span v-if="order.estimatedDelivery" class="text-sm text-gray-500">
                  Est. Delivery: {{ formatDate(order.estimatedDelivery) }}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  v-if="order.status === 'pending'"
                  @click="cancelOrder(order.id)"
                  class="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel Order
                </button>
                <button
                  v-if="order.status === 'delivered'"
                  @click="reorderItems(order)"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reorder
                </button>
                <button
                  v-if="order.trackingNumber"
                  @click="trackOrder(order.trackingNumber)"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Track Package
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
        <p class="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
        <div class="mt-6">
          <router-link
            to="/shop"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            Start Shopping
          </router-link>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              to <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }}</span>
              of <span class="font-medium">{{ filteredOrders.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  page === currentPage
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                ]"
              >
                {{ page }}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { user, logout: authLogout } = useAuth();

// State
const showDropdown = ref(false);
const statusFilter = ref('');
const sortBy = ref('newest');
const currentPage = ref(1);
const itemsPerPage = ref(5);

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

// Mock orders data
const orders = ref([
  {
    id: 'ORD-1704067200000',
    orderNumber: 'ORD-1704067200000',
    orderDate: '2024-01-01T10:00:00Z',
    status: 'delivered',
    total: 499.97,
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-05T18:00:00Z',
    items: [
      {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        price: 99.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 2,
        name: 'Smart Fitness Watch',
        price: 199.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      }
    ]
  },
  {
    id: 'ORD-1704153600000',
    orderNumber: 'ORD-1704153600000',
    orderDate: '2024-01-02T14:30:00Z',
    status: 'shipped',
    total: 24.99,
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2024-01-08T12:00:00Z',
    items: [
      {
        id: 3,
        name: 'Organic Cotton T-Shirt',
        price: 24.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      }
    ]
  },
  {
    id: 'ORD-1704240000000',
    orderNumber: 'ORD-1704240000000',
    orderDate: '2024-01-03T09:15:00Z',
    status: 'processing',
    total: 89.98,
    trackingNumber: null,
    estimatedDelivery: '2024-01-10T16:00:00Z',
    items: [
      {
        id: 4,
        name: 'Indoor Plant Collection',
        price: 49.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 5,
        name: 'Yoga Mat Premium',
        price: 39.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      }
    ]
  },
  {
    id: 'ORD-1704326400000',
    orderNumber: 'ORD-1704326400000',
    orderDate: '2024-01-04T16:45:00Z',
    status: 'pending',
    total: 29.99,
    trackingNumber: null,
    estimatedDelivery: '2024-01-12T14:00:00Z',
    items: [
      {
        id: 6,
        name: 'Programming Fundamentals Book',
        price: 29.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      }
    ]
  }
]);

// Computed properties
const filteredOrders = computed(() => {
  let filtered = orders.value;

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value);
  }

  // Sort orders
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'oldest':
        return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
      case 'total':
        return b.total - a.total;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
    }
  });

  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Methods
const getStatusClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status: string) => {
  const texts = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  return texts[status] || status;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const cancelOrder = async (orderId: string) => {
  if (confirm('Are you sure you want to cancel this order?')) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const order = orders.value.find(o => o.id === orderId);
      if (order) {
        order.status = 'cancelled';
      }
      
      alert('Order cancelled successfully.');
    } catch (error) {
      alert('Failed to cancel order. Please try again.');
    }
  }
};

const reorderItems = (order: any) => {
  // In a real app, this would add items to cart
  alert('Items added to cart for reorder!');
  router.push('/cart');
};

const trackOrder = (trackingNumber: string) => {
  // In a real app, this would redirect to tracking page
  router.push(`/delivery/track/${trackingNumber}`);
};

const logout = () => {
  authLogout();
  router.push('/login');
};

// Initialize
onMounted(() => {
  // Load orders from API
  console.log('Loading orders...');
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

