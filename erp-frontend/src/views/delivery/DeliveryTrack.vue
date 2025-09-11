<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/dashboard" class="hidden text-xl font-bold text-gray-900">ERP System</router-link>
          </div>
          <div class="flex items-center space-x-4">
            <!-- User Menu -->
            <div class="hidden relative">
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
    <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Track Your Package</h1>
              <p class="mt-1 text-sm text-gray-500">Real-time tracking information for your delivery</p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <div class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                In Transit
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tracking Information -->
      <div v-if="trackingInfo" class="space-y-6">
        <!-- Package Details -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Package Information</h3>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2">Tracking Details</h4>
                <div class="space-y-2 text-sm">
                  <p><span class="font-medium">Tracking Number:</span> {{ trackingInfo.trackingNumber }}</p>
                  <p><span class="font-medium">Order Number:</span> {{ trackingInfo.orderNumber }}</p>
                  <p><span class="font-medium">Carrier:</span> {{ trackingInfo.carrier }}</p>
                  <p><span class="font-medium">Service:</span> {{ trackingInfo.service }}</p>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2">Delivery Information</h4>
                <div class="space-y-2 text-sm">
                  <p><span class="font-medium">Estimated Delivery:</span> {{ formatDate(trackingInfo.estimatedDelivery) }}</p>
                  <p><span class="font-medium">Current Status:</span> 
                    <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ trackingInfo.currentStatus }}
                    </span>
                  </p>
                  <p><span class="font-medium">Weight:</span> {{ trackingInfo.weight }}</p>
                  <p><span class="font-medium">Dimensions:</span> {{ trackingInfo.dimensions }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tracking Timeline -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Tracking History</h3>
            <div class="flow-root">
              <ul class="-mb-8">
                <li v-for="(event, index) in trackingInfo.events" :key="index" class="relative pb-8">
                  <div v-if="index !== trackingInfo.events.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></div>
                  <div class="relative flex space-x-3">
                    <div>
                      <span
                        class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                        :class="event.completed ? 'bg-indigo-600' : 'bg-gray-300'"
                      >
                        <svg v-if="event.completed" class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        <svg v-else class="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ event.status }}</p>
                        <p class="text-sm text-gray-500">{{ event.description }}</p>
                        <p v-if="event.location" class="text-sm text-gray-500">{{ event.location }}</p>
                      </div>
                      <div class="text-right text-sm whitespace-nowrap text-gray-500">
                        <time :datetime="event.timestamp">{{ formatDateTime(event.timestamp) }}</time>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Delivery Address -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Delivery Address</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm">
                <p class="font-medium text-gray-900">{{ trackingInfo.deliveryAddress.name }}</p>
                <p>{{ trackingInfo.deliveryAddress.address }}</p>
                <p>{{ trackingInfo.deliveryAddress.city }}, {{ trackingInfo.deliveryAddress.state }} {{ trackingInfo.deliveryAddress.zipCode }}</p>
                <p>{{ trackingInfo.deliveryAddress.country }}</p>
                <p class="mt-2 text-gray-500">Phone: {{ trackingInfo.deliveryAddress.phone }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Package Contents -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Package Contents</h3>
            <div class="space-y-3">
              <div
                v-for="item in trackingInfo.items"
                :key="item.id"
                class="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="h-12 w-12 object-cover rounded-md"
                />
                <div class="flex-1">
                  <h5 class="text-sm font-medium text-gray-900">{{ item.name }}</h5>
                  <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tracking information not found</h3>
        <p class="mt-1 text-sm text-gray-500">The tracking number you're looking for doesn't exist or is not available yet.</p>
        <div class="mt-6">
          <router-link
            to="/orders"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View My Orders
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const route = useRoute();
const { user, logout: authLogout } = useAuth();

// State
const showDropdown = ref(false);
const trackingInfo = ref<any>(null);

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const logout = () => {
  authLogout();
  router.push('/login');
};

const loadTrackingInfo = async () => {
  const trackingNumber = route.params.id;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock tracking data
    const mockTrackingInfo = {
      trackingNumber: trackingNumber,
      orderNumber: 'ORD-1704067200000',
      carrier: 'FedEx',
      service: 'Ground',
      currentStatus: 'In Transit',
      estimatedDelivery: '2024-01-05T18:00:00Z',
      weight: '2.5 lbs',
      dimensions: '12 x 8 x 4 in',
      events: [
        {
          status: 'Package Delivered',
          description: 'Package has been delivered to the recipient',
          location: 'New York, NY 10001',
          timestamp: '2024-01-05T14:30:00Z',
          completed: true
        },
        {
          status: 'Out for Delivery',
          description: 'Package is out for delivery',
          location: 'New York, NY Distribution Center',
          timestamp: '2024-01-05T08:00:00Z',
          completed: true
        },
        {
          status: 'In Transit',
          description: 'Package is in transit to the destination',
          location: 'Philadelphia, PA Distribution Center',
          timestamp: '2024-01-04T16:45:00Z',
          completed: true
        },
        {
          status: 'Package Processed',
          description: 'Package has been processed at the origin facility',
          location: 'Los Angeles, CA Distribution Center',
          timestamp: '2024-01-03T22:15:00Z',
          completed: true
        },
        {
          status: 'Package Received',
          description: 'Package has been received by the carrier',
          location: 'Los Angeles, CA',
          timestamp: '2024-01-03T10:30:00Z',
          completed: true
        }
      ],
      deliveryAddress: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        phone: '+1 (555) 123-4567'
      },
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
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        }
      ]
    };
    
    trackingInfo.value = mockTrackingInfo;
  } catch (error) {
    console.error('Failed to load tracking information:', error);
  }
};

// Initialize
onMounted(() => {
  loadTrackingInfo();
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

