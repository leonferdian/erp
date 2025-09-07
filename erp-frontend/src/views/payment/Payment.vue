<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/dashboard" class="text-xl font-bold text-gray-900">ERP System</router-link>
          </div>
          <div class="flex items-center space-x-4">
            <!-- User Menu -->
            <div class="relative">
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
                <router-link to="/payment/history" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Payment History</router-link>
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
          <h1 class="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p class="mt-1 text-sm text-gray-500">Manage your payment methods and transactions</p>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Payment Methods</h3>
            <button
              @click="showAddPaymentModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Payment Method
            </button>
          </div>
          
          <div class="space-y-4">
            <div
              v-for="method in paymentMethods"
              :key="method.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <span class="text-xs font-medium text-gray-600">{{ method.type }}</span>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ method.type }} ending in {{ method.last4 }}</p>
                  <p class="text-sm text-gray-500">Expires {{ method.expiryDate }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  v-if="method.isDefault"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  Default
                </span>
                <button
                  @click="setDefaultMethod(method)"
                  :disabled="method.isDefault"
                  class="text-indigo-600 hover:text-indigo-900 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Set Default
                </button>
                <button
                  @click="removePaymentMethod(method)"
                  class="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Recent Transactions</h3>
            <router-link
              to="/payment/history"
              class="text-sm text-indigo-600 hover:text-indigo-500"
            >
              View all
            </router-link>
          </div>
          
          <div class="space-y-4">
            <div
              v-for="transaction in recentTransactions"
              :key="transaction.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center"
                    :class="getTransactionIconClass(transaction.type)"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ transaction.description }}</p>
                  <p class="text-sm text-gray-500">{{ formatDate(transaction.date) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p
                  class="text-sm font-medium"
                  :class="transaction.amount > 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ transaction.amount > 0 ? '+' : '' }}${{ Math.abs(transaction.amount).toFixed(2) }}
                </p>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(transaction.status)"
                >
                  {{ transaction.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Payment Method Modal -->
    <div v-if="showAddPaymentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Add Payment Method</h3>
          
          <form @submit.prevent="addPaymentMethod" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                v-model="paymentForm.cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  v-model="paymentForm.expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  v-model="paymentForm.cvv"
                  type="text"
                  placeholder="123"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Cardholder Name</label>
              <input
                v-model="paymentForm.cardholderName"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div class="flex items-center">
              <input
                v-model="paymentForm.isDefault"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Set as default payment method</label>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showAddPaymentModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {{ isLoading ? 'Adding...' : 'Add Payment Method' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { user, logout: authLogout } = useAuth();

// State
const showDropdown = ref(false);
const showAddPaymentModal = ref(false);
const isLoading = ref(false);

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const paymentForm = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
  isDefault: false
});

// Mock data
const paymentMethods = ref([
  {
    id: 1,
    type: 'Visa',
    last4: '4242',
    expiryDate: '12/25',
    isDefault: true
  },
  {
    id: 2,
    type: 'Mastercard',
    last4: '5555',
    expiryDate: '08/26',
    isDefault: false
  }
]);

const recentTransactions = ref([
  {
    id: 1,
    description: 'Order #ORD-1704067200000',
    amount: -99.99,
    type: 'purchase',
    status: 'completed',
    date: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    description: 'Refund for Order #ORD-1704153600000',
    amount: 24.99,
    type: 'refund',
    status: 'completed',
    date: '2024-01-02T14:30:00Z'
  },
  {
    id: 3,
    description: 'Order #ORD-1704240000000',
    amount: -199.99,
    type: 'purchase',
    status: 'pending',
    date: '2024-01-03T09:15:00Z'
  }
]);

// Methods
const getTransactionIconClass = (type: string) => {
  const classes = {
    purchase: 'bg-red-100 text-red-600',
    refund: 'bg-green-100 text-green-600',
    deposit: 'bg-blue-100 text-blue-600'
  };
  return classes[type] || 'bg-gray-100 text-gray-600';
};

const getStatusClass = (status: string) => {
  const classes = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const setDefaultMethod = async (method: any) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove default from all methods
    paymentMethods.value.forEach(m => m.isDefault = false);
    
    // Set new default
    method.isDefault = true;
    
    alert('Default payment method updated successfully.');
  } catch (error) {
    alert('Failed to update default payment method. Please try again.');
  }
};

const removePaymentMethod = async (method: any) => {
  if (confirm(`Are you sure you want to remove this payment method?`)) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const index = paymentMethods.value.findIndex(m => m.id === method.id);
      if (index > -1) {
        paymentMethods.value.splice(index, 1);
      }
      
      alert('Payment method removed successfully.');
    } catch (error) {
      alert('Failed to remove payment method. Please try again.');
    }
  }
};

const addPaymentMethod = async () => {
  isLoading.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newMethod = {
      id: Date.now(),
      type: 'Visa', // In real app, this would be determined by card number
      last4: paymentForm.value.cardNumber.slice(-4),
      expiryDate: paymentForm.value.expiryDate,
      isDefault: paymentForm.value.isDefault
    };
    
    // If setting as default, remove default from others
    if (paymentForm.value.isDefault) {
      paymentMethods.value.forEach(m => m.isDefault = false);
    }
    
    paymentMethods.value.push(newMethod);
    
    // Reset form
    paymentForm.value = {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      isDefault: false
    };
    
    showAddPaymentModal.value = false;
    alert('Payment method added successfully.');
  } catch (error) {
    alert('Failed to add payment method. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

const logout = () => {
  authLogout();
  router.push('/login');
};

// Initialize
onMounted(() => {
  // Load payment methods and transactions from API
  console.log('Loading payment data...');
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

