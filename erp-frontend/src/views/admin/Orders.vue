<template>
  <AdminLayout page-title="Order Management" page-description="Manage and track all orders">
    <!-- Action Bar -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search orders..."
            class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        <!-- Status Filter -->
        <select
          v-model="statusFilter"
          class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <!-- Date Filter -->
        <select
          v-model="dateFilter"
          class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
      
      <div class="mt-4 sm:mt-0">
        <button
          @click="exportOrders"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span class="text-xs font-medium text-gray-600">#{{ order.orderNumber.slice(-4) }}</span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ order.orderNumber }}</div>
                      <div class="text-sm text-gray-500">{{ order.items.length }} item(s)</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ order.customerName }}</div>
                  <div class="text-sm text-gray-500">{{ order.customerEmail }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    :value="order.status"
                    @change="updateOrderStatus(order, $event.target.value)"
                    class="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ order.total.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.orderDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewOrderDetails(order)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </button>
                    <button
                      @click="editOrder(order)"
                      class="text-yellow-600 hover:text-yellow-900"
                    >
                      Edit
                    </button>
                    <button
                      @click="printOrder(order)"
                      class="text-gray-600 hover:text-gray-900"
                    >
                      Print
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showOrderDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              Order Details - {{ selectedOrder?.orderNumber }}
            </h3>
            <button
              @click="showOrderDetailsModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div v-if="selectedOrder" class="space-y-6">
            <!-- Order Info -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Order Information</h4>
                <div class="space-y-1 text-sm">
                  <p><span class="font-medium">Order Number:</span> {{ selectedOrder.orderNumber }}</p>
                  <p><span class="font-medium">Date:</span> {{ formatDate(selectedOrder.orderDate) }}</p>
                  <p><span class="font-medium">Status:</span> 
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2"
                      :class="getStatusClass(selectedOrder.status)"
                    >
                      {{ selectedOrder.status }}
                    </span>
                  </p>
                  <p><span class="font-medium">Total:</span> ${{ selectedOrder.total.toFixed(2) }}</p>
                </div>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Customer Information</h4>
                <div class="space-y-1 text-sm">
                  <p><span class="font-medium">Name:</span> {{ selectedOrder.customerName }}</p>
                  <p><span class="font-medium">Email:</span> {{ selectedOrder.customerEmail }}</p>
                  <p><span class="font-medium">Phone:</span> {{ selectedOrder.customerPhone }}</p>
                </div>
              </div>
            </div>
            
            <!-- Order Items -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-3">Order Items</h4>
              <div class="space-y-3">
                <div
                  v-for="item in selectedOrder.items"
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
                    <p class="text-sm text-gray-500">${{ item.price }} each</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Shipping Address -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-3">Shipping Address</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-sm">
                  <p>{{ selectedOrder.shippingAddress.name }}</p>
                  <p>{{ selectedOrder.shippingAddress.address }}</p>
                  <p>{{ selectedOrder.shippingAddress.city }}, {{ selectedOrder.shippingAddress.state }} {{ selectedOrder.shippingAddress.zipCode }}</p>
                  <p>{{ selectedOrder.shippingAddress.country }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../../components/AdminLayout.vue';

// State
const searchQuery = ref('');
const statusFilter = ref('');
const dateFilter = ref('');
const showOrderDetailsModal = ref(false);
const selectedOrder = ref<any>(null);

// Mock orders data
const orders = ref([
  {
    id: 'ORD-1704067200000',
    orderNumber: 'ORD-1704067200000',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1 (555) 123-4567',
    status: 'delivered',
    total: 499.97,
    orderDate: '2024-01-01T10:00:00Z',
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
      country: 'United States'
    }
  },
  {
    id: 'ORD-1704153600000',
    orderNumber: 'ORD-1704153600000',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '+1 (555) 987-6543',
    status: 'shipped',
    total: 24.99,
    orderDate: '2024-01-02T14:30:00Z',
    items: [
      {
        id: 3,
        name: 'Organic Cotton T-Shirt',
        price: 24.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      }
    ],
    shippingAddress: {
      name: 'Jane Smith',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States'
    }
  },
  {
    id: 'ORD-1704240000000',
    orderNumber: 'ORD-1704240000000',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    customerPhone: '+1 (555) 456-7890',
    status: 'processing',
    total: 89.98,
    orderDate: '2024-01-03T09:15:00Z',
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
    ],
    shippingAddress: {
      name: 'Bob Johnson',
      address: '789 Pine Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'United States'
    }
  }
]);

// Computed properties
const filteredOrders = computed(() => {
  let filtered = orders.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(order =>
      order.orderNumber.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerEmail.toLowerCase().includes(query)
    );
  }

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value);
  }

  // Filter by date
  if (dateFilter.value) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.orderDate);
      
      switch (dateFilter.value) {
        case 'today':
          return orderDate >= today;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return orderDate >= monthAgo;
        default:
          return true;
      }
    });
  }

  return filtered;
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const updateOrderStatus = async (order: any, newStatus: string) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    order.status = newStatus;
    alert(`Order status updated to ${newStatus}.`);
  } catch (error) {
    alert('Failed to update order status. Please try again.');
  }
};

const viewOrderDetails = (order: any) => {
  selectedOrder.value = order;
  showOrderDetailsModal.value = true;
};

const editOrder = (order: any) => {
  // In a real app, this would open an edit modal or navigate to edit page
  alert(`Edit order ${order.orderNumber} - Feature coming soon!`);
};

const printOrder = (order: any) => {
  // In a real app, this would generate a printable order
  window.print();
};

const exportOrders = () => {
  // In a real app, this would export orders to CSV/Excel
  alert('Exporting orders...');
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

