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
              <router-link to="/shop" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">Shop</router-link>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <router-link to="/cart" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">Cart</router-link>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">Checkout</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h1 class="text-2xl font-bold text-gray-900">Checkout</h1>
          <p class="mt-1 text-sm text-gray-500">Complete your order securely</p>
        </div>
      </div>

      <!-- Checkout Form -->
      <form @submit.prevent="processOrder" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Checkout Steps -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Step 1: Shipping Information -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center mb-4">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">1</span>
                  </div>
                </div>
                <h3 class="ml-3 text-lg font-medium text-gray-900">Shipping Information</h3>
              </div>
              
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    v-model="shippingForm.firstName"
                    type="text"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    v-model="shippingForm.lastName"
                    type="text"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    v-model="shippingForm.address"
                    type="text"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">City</label>
                  <input
                    v-model="shippingForm.city"
                    type="text"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">State/Province</label>
                  <input
                    v-model="shippingForm.state"
                    type="text"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">ZIP/Postal Code</label>
                  <input
                    v-model="shippingForm.zipCode"
                    type="text"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Country</label>
                  <select
                    v-model="shippingForm.country"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                  </select>
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    v-model="shippingForm.phone"
                    type="tel"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Payment Information -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center mb-4">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">2</span>
                  </div>
                </div>
                <h3 class="ml-3 text-lg font-medium text-gray-900">Payment Information</h3>
              </div>
              
              <!-- Payment Method Selection -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                <div class="space-y-3">
                  <label class="flex items-center">
                    <input
                      v-model="paymentForm.method"
                      type="radio"
                      value="card"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span class="ml-3 text-sm text-gray-700">Credit/Debit Card</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="paymentForm.method"
                      type="radio"
                      value="paypal"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span class="ml-3 text-sm text-gray-700">PayPal</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="paymentForm.method"
                      type="radio"
                      value="apple"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span class="ml-3 text-sm text-gray-700">Apple Pay</span>
                  </label>
                </div>
              </div>
              
              <!-- Card Information -->
              <div v-if="paymentForm.method === 'card'" class="space-y-4">
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
              </div>
              
              <!-- PayPal/Apple Pay Info -->
              <div v-else-if="paymentForm.method === 'paypal'" class="text-center py-8">
                <div class="text-gray-500">
                  <svg class="mx-auto h-12 w-12 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.543-.676c-.608-.685-1.46-1.033-2.55-1.033H9.342a.641.641 0 0 0-.633.74l-1.12 7.106h4.19c.524 0 .968-.382 1.05-.9l1.12-7.106h2.19c1.09 0 1.942.348 2.55 1.033.608.685.913 1.65.913 2.89 0 .143-.023.288-.047.437-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106h4.19c.524 0 .968-.382 1.05-.9l1.12-7.106h2.19c1.09 0 1.942-.348 2.55-1.033.608-.685.913-1.65.913-2.89 0-.143.023-.288.047-.437.023-.143.047-.288.077-.437z"/>
                  </svg>
                  <p>You will be redirected to PayPal to complete your payment</p>
                </div>
              </div>
              
              <div v-else-if="paymentForm.method === 'apple'" class="text-center py-8">
                <div class="text-gray-500">
                  <svg class="mx-auto h-12 w-12 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <p>You will be redirected to Apple Pay to complete your payment</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Review & Confirm -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center mb-4">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">3</span>
                  </div>
                </div>
                <h3 class="ml-3 text-lg font-medium text-gray-900">Review & Confirm</h3>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="termsAccepted"
                    type="checkbox"
                    required
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">
                    I agree to the <a href="#" class="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" class="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                  </label>
                </div>
                
                <div class="flex items-center">
                  <input
                    v-model="newsletterSignup"
                    type="checkbox"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-700">
                    Subscribe to our newsletter for updates and special offers
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow rounded-lg sticky top-6">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
              
              <!-- Order Items -->
              <div class="space-y-3 mb-6">
                <div
                  v-for="item in orderItems"
                  :key="item.id"
                  class="flex items-center space-x-3"
                >
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="h-12 w-12 object-cover rounded-md"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
                    <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                  </div>
                  <p class="text-sm font-medium text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
              
              <!-- Order Totals -->
              <div class="space-y-3 border-t border-gray-200 pt-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="font-medium">${{ subtotal.toFixed(2) }}</span>
                </div>
                
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Shipping</span>
                  <span class="font-medium">{{ shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}` }}</span>
                </div>
                
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Tax</span>
                  <span class="font-medium">${{ tax.toFixed(2) }}</span>
                </div>
                
                <div v-if="appliedPromo" class="flex justify-between text-sm text-green-600">
                  <span>Discount ({{ appliedPromo.description }})</span>
                  <span class="font-medium">-${{ discountAmount.toFixed(2) }}</span>
                </div>
                
                <div class="border-t border-gray-200 pt-3">
                  <div class="flex justify-between text-base font-medium">
                    <span class="text-gray-900">Total</span>
                    <span class="text-gray-900">${{ total.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Place Order Button -->
              <button
                type="submit"
                :disabled="!termsAccepted || isProcessing"
                class="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isProcessing" class="mr-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isProcessing ? 'Processing...' : 'Place Order' }}
              </button>
              
              <!-- Security Notice -->
              <div class="mt-4 flex items-center text-sm text-gray-500">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Secure checkout with SSL encryption
              </div>
            </div>
          </div>
        </div>
      </form>
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
const isProcessing = ref(false);
const termsAccepted = ref(false);
const newsletterSignup = ref(false);
const appliedPromo = ref<any>(null);

const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

// Form data
const shippingForm = ref({
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  phone: ''
});

const paymentForm = ref({
  method: 'card',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: ''
});

// Mock order data
const orderItems = ref([
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
]);

// Computed properties
const subtotal = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const shippingCost = computed(() => {
  return subtotal.value >= 100 ? 0 : 9.99;
});

const tax = computed(() => {
  return subtotal.value * 0.08; // 8% tax
});

const discountAmount = computed(() => {
  if (!appliedPromo.value) return 0;
  
  let amount = subtotal.value + shippingCost.value + tax.value;
  
  if (appliedPromo.value.type === 'percentage') {
    return amount * (appliedPromo.value.value / 100);
  } else if (appliedPromo.value.type === 'fixed') {
    return appliedPromo.value.value;
  }
  
  return 0;
});

const total = computed(() => {
  let totalAmount = subtotal.value + shippingCost.value + tax.value;
  
  if (appliedPromo.value) {
    totalAmount -= discountAmount.value;
  }
  
  return Math.max(0, totalAmount);
});

// Methods
const processOrder = async () => {
  if (!termsAccepted.value) {
    alert('Please accept the terms and conditions to continue.');
    return;
  }
  
  isProcessing.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate order number
    const orderNumber = 'ORD-' + Date.now();
    
    // Redirect to order confirmation
    router.push({
      name: 'OrderDetail',
      params: { id: orderNumber }
    });
  } catch (error) {
    console.error('Order processing failed:', error);
    alert('Order processing failed. Please try again.');
  } finally {
    isProcessing.value = false;
  }
};

const logout = () => {
  authLogout();
  router.push('/login');
};

// Initialize
onMounted(() => {
  // Load user data into shipping form
  if (user.value) {
    shippingForm.value.firstName = user.value.name?.split(' ')[0] || '';
    shippingForm.value.lastName = user.value.name?.split(' ').slice(1).join(' ') || '';
    shippingForm.value.address = user.value.address || '';
    shippingForm.value.phone = user.value.phone || '';
  }
  
  // Load applied promo from localStorage
  const savedPromo = localStorage.getItem('appliedPromo');
  if (savedPromo) {
    appliedPromo.value = JSON.parse(savedPromo);
  }
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

