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
    <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
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
              <router-link to="/orders" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">My Orders</router-link>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">Order Details</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <svg class="animate-spin mx-auto h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-sm text-gray-500">Loading order details...</p>
      </div>

      <!-- Order Details -->
      <div v-else-if="order" class="space-y-6">
        <!-- Order Header -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Order #{{ order.orderNumber }}</h1>
                <p class="mt-1 text-sm text-gray-500">Placed on {{ formatDate(order.orderDate) }}</p>
              </div>
              <div class="flex items-center space-x-4">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="getStatusClass(order.status)"
                >
                  {{ getStatusText(order.status) }}
                </span>
                <button
                  @click="printOrder"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                  </svg>
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Status Timeline -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
            <div class="flow-root">
              <ul class="-mb-8">
                <li v-for="(step, index) in orderTimeline" :key="step.status" class="relative pb-8">
                  <div v-if="index !== orderTimeline.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></div>
                  <div class="relative flex space-x-3">
                    <div>
                      <span
                        class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                        :class="step.completed ? 'bg-indigo-600' : 'bg-gray-300'"
                      >
                        <svg v-if="step.completed" class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        <svg v-else class="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                      </span>
                    </div>
                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ step.title }}</p>
                        <p class="text-sm text-gray-500">{{ step.description }}</p>
                      </div>
                      <div class="text-right text-sm whitespace-nowrap text-gray-500">
                        <time v-if="step.date" :datetime="step.date">{{ formatDate(step.date) }}</time>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
            <div class="space-y-4">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="h-20 w-20 object-cover rounded-md"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="text-lg font-medium text-gray-900">{{ item.name }}</h4>
                  <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
                  <p class="text-sm text-gray-500">Unit Price: ${{ item.price.toFixed(2) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-semibold text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping Information -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700">Shipping Address</h4>
                <div class="mt-2 text-sm text-gray-900">
                  <p>{{ order.shippingAddress.name }}</p>
                  <p>{{ order.shippingAddress.address }}</p>
                  <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zipCode }}</p>
                  <p>{{ order.shippingAddress.country }}</p>
                  <p>{{ order.shippingAddress.phone }}</p>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-700">Shipping Method</h4>
                <div class="mt-2 text-sm text-gray-900">
                  <p>{{ order.shippingMethod.name }}</p>
                  <p>Estimated Delivery: {{ formatDate(order.estimatedDelivery) }}</p>
                  <p v-if="order.trackingNumber">Tracking: {{ order.trackingNumber }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Information -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700">Payment Method</h4>
                <div class="mt-2 text-sm text-gray-900">
                  <p>{{ order.paymentMethod.type }} ending in {{ order.paymentMethod.last4 }}</p>
                  <p>Expires: {{ order.paymentMethod.expiryDate }}</p>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-700">Billing Address</h4>
                <div class="mt-2 text-sm text-gray-900">
                  <p>{{ order.billingAddress.name }}</p>
                  <p>{{ order.billingAddress.address }}</p>
                  <p>{{ order.billingAddress.city }}, {{ order.billingAddress.state }} {{ order.billingAddress.zipCode }}</p>
                  <p>{{ order.billingAddress.country }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">${{ order.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium">${{ order.shipping.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tax</span>
                <span class="font-medium">${{ order.tax.toFixed(2) }}</span>
              </div>
              <div v-if="order.discount > 0" class="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span class="font-medium">-${{ order.discount.toFixed(2) }}</span>
              </div>
              <div class="border-t border-gray-200 pt-3">
                <div class="flex justify-between text-base font-medium">
                  <span class="text-gray-900">Total</span>
                  <span class="text-gray-900">${{ order.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Actions -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Need Help?</h3>
                <p class="mt-1 text-sm text-gray-500">Contact our customer support team for assistance.</p>
              </div>
              <div class="flex items-center space-x-3">
                <button
                  v-if="order.status === 'pending'"
                  @click="cancelOrder"
                  class="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel Order
                </button>
                <button
                  v-if="order.status === 'delivered'"
                  @click="reorderItems"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reorder Items
                </button>
                <button
                  v-if="order.trackingNumber"
                  @click="trackOrder"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Track Package
                </button>
                <button
                  @click="contactSupport"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Not Found -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Order not found</h3>
        <p class="mt-1 text-sm text-gray-500">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <div class="mt-6">
          <router-link
            to="/orders"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Orders
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const route = useRoute();
const { user, logout: authLogout } = useAuth();

// State
const isLoading = ref(true);
const showDropdown = ref(false);
const order = ref<any>(null);

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

// Computed properties
const orderTimeline = computed(() => {
  if (!order.value) return [];
  
  const timeline = [
    {
      status: 'pending',
      title: 'Order Placed',
      description: 'Your order has been received and is being processed.',
      completed: true,
      date: order.value.orderDate
    },
    {
      status: 'processing',
      title: 'Processing',
      description: 'Your order is being prepared for shipment.',
      completed: ['processing', 'shipped', 'delivered'].includes(order.value.status),
      date: order.value.status === 'pending' ? null : order.value.orderDate
    },
    {
      status: 'shipped',
      title: 'Shipped',
      description: 'Your order has been shipped and is on its way.',
      completed: ['shipped', 'delivered'].includes(order.value.status),
      date: order.value.status === 'pending' || order.value.status === 'processing' ? null : order.value.orderDate
    },
    {
      status: 'delivered',
      title: 'Delivered',
      description: 'Your order has been delivered successfully.',
      completed: order.value.status === 'delivered',
      date: order.value.status === 'delivered' ? order.value.estimatedDelivery : null
    }
  ];
  
  return timeline;
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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const printOrder = () => {
  window.print();
};

const cancelOrder = async () => {
  if (confirm('Are you sure you want to cancel this order?')) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (order.value) {
        order.value.status = 'cancelled';
      }
      
      alert('Order cancelled successfully.');
    } catch (error) {
      alert('Failed to cancel order. Please try again.');
    }
  }
};

const reorderItems = () => {
  alert('Items added to cart for reorder!');
  router.push('/cart');
};

const trackOrder = () => {
  if (order.value?.trackingNumber) {
    router.push(`/delivery/track/${order.value.trackingNumber}`);
  }
};

const contactSupport = () => {
  // In a real app, this would open a support chat or redirect to support page
  alert('Redirecting to customer support...');
};

const logout = () => {
  authLogout();
  router.push('/login');
};

const loadOrder = async () => {
  isLoading.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock order data
    const mockOrder = {
      id: route.params.id,
      orderNumber: route.params.id,
      orderDate: '2024-01-01T10:00:00Z',
      status: 'delivered',
      total: 499.97,
      subtotal: 399.97,
      shipping: 9.99,
      tax: 32.00,
      discount: 0,
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
      ],
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        phone: '+1 (555) 123-4567'
      },
      billingAddress: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      shippingMethod: {
        name: 'Standard Shipping',
        cost: 9.99
      },
      paymentMethod: {
        type: 'Visa',
        last4: '4242',
        expiryDate: '12/25'
      }
    };
    
    order.value = mockOrder;
  } catch (error) {
    console.error('Failed to load order:', error);
  } finally {
    isLoading.value = false;
  }
};

// Initialize
onMounted(() => {
  loadOrder();
});
</script>

<style scoped>
/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}
</style>

