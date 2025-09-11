<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div class="flex space-x-4">
          <select
            v-model="selectedPeriod"
            @change="updateAnalytics"
            class="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            @click="exportAnalytics"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Export Data
          </button>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ analytics.totalOrders }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                  <dd class="text-lg font-medium text-gray-900">${{ analytics.revenue.toLocaleString() }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">New Customers</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ analytics.newCustomers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Growth Rate</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ analytics.growthRate }}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Sales Chart -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Sales Trend</h3>
          <div class="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p class="mt-2 text-sm text-gray-500">Sales chart would be displayed here</p>
            </div>
          </div>
        </div>

        <!-- Top Products Chart -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
          <div class="space-y-4">
            <div v-for="product in topProducts" :key="product.id" class="flex items-center justify-between">
              <div class="flex items-center">
                <img
                  :src="product.image || '/placeholder-product.jpg'"
                  :alt="product.name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-sm text-gray-500">{{ product.sales }} sales</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">${{ product.revenue.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Analytics -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Customer Segments</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">New Customers</span>
              <span class="text-sm font-medium">{{ customerSegments.new }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Returning Customers</span>
              <span class="text-sm font-medium">{{ customerSegments.returning }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">VIP Customers</span>
              <span class="text-sm font-medium">{{ customerSegments.vip }}%</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Completed</span>
              <span class="text-sm font-medium">{{ orderStatus.completed }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Pending</span>
              <span class="text-sm font-medium">{{ orderStatus.pending }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Cancelled</span>
              <span class="text-sm font-medium">{{ orderStatus.cancelled }}%</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue by Category</h3>
          <div class="space-y-3">
            <div v-for="category in revenueByCategory" :key="category.name" class="flex justify-between">
              <span class="text-sm text-gray-600">{{ category.name }}</span>
              <span class="text-sm font-medium">${{ category.revenue.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '../../components/AdminLayout.vue'

const selectedPeriod = ref('30')
const loading = ref(true)

const analytics = ref({
  totalOrders: 1250,
  revenue: 125000,
  newCustomers: 85,
  growthRate: 15.5
})

const topProducts = ref([
  {
    id: 1,
    name: 'Wireless Headphones',
    image: '/placeholder-product.jpg',
    sales: 150,
    revenue: 15000
  },
  {
    id: 2,
    name: 'Smart Watch',
    image: '/placeholder-product.jpg',
    sales: 120,
    revenue: 18000
  },
  {
    id: 3,
    name: 'Laptop Stand',
    image: '/placeholder-product.jpg',
    sales: 95,
    revenue: 4750
  }
])

const customerSegments = ref({
  new: 35,
  returning: 50,
  vip: 15
})

const orderStatus = ref({
  completed: 75,
  pending: 20,
  cancelled: 5
})

const revenueByCategory = ref([
  { name: 'Electronics', revenue: 75000 },
  { name: 'Clothing', revenue: 30000 },
  { name: 'Books', revenue: 20000 }
])

const fetchAnalytics = async () => {
  try {
    loading.value = true
    // Mock data - in real app, fetch from API
    console.log('Fetching analytics for period:', selectedPeriod.value)
  } catch (error) {
    console.error('Error fetching analytics:', error)
  } finally {
    loading.value = false
  }
}

const updateAnalytics = () => {
  fetchAnalytics()
}

const exportAnalytics = () => {
  console.log('Exporting analytics data')
}

onMounted(() => {
  fetchAnalytics()
})
</script>

