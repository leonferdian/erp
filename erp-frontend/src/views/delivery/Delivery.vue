<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Delivery Management</h1>
      <p class="mt-2 text-gray-600">Track and manage your package deliveries</p>
    </div>

    <!-- Delivery Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Shipments</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.totalShipments }}</dd>
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Delivered</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.delivered }}</dd>
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">In Transit</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.inTransit }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Delayed</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.delayed }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by tracking number or order..."
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <select
            v-model="filters.status"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            <option value="shipped">Shipped</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="delayed">Delayed</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Carrier</label>
          <select
            v-model="filters.carrier"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Carriers</option>
            <option value="ups">UPS</option>
            <option value="fedex">FedEx</option>
            <option value="dhl">DHL</option>
            <option value="usps">USPS</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="applyFilters"
            class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Deliveries List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="deliveries.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No deliveries found</h3>
        <p class="mt-1 text-sm text-gray-500">No delivery records match your current filters.</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div v-for="delivery in deliveries" :key="delivery.id" class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <img
                    :src="getCarrierIcon(delivery.carrier)"
                    :alt="delivery.carrier"
                    class="w-8 h-8"
                  />
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ delivery.trackingNumber }}
                </div>
                <div class="text-sm text-gray-500">
                  Order #{{ delivery.orderNumber }} • {{ delivery.carrier.toUpperCase() }}
                </div>
                <div class="text-xs text-gray-400 mt-1">
                  Shipped on {{ formatDate(delivery.shippedDate) }}
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">
                  {{ delivery.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ delivery.currentLocation }}
                </div>
                <div v-if="delivery.estimatedDelivery" class="text-xs text-gray-400">
                  ETA: {{ formatDate(delivery.estimatedDelivery) }}
                </div>
              </div>
              <div class="flex flex-col space-y-2">
                <button
                  @click="trackPackage(delivery.trackingNumber)"
                  class="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                >
                  Track
                </button>
                <button
                  @click="viewDetails(delivery)"
                  class="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  Details
                </button>
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mt-4">
            <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Shipped</span>
              <span>In Transit</span>
              <span>Out for Delivery</span>
              <span>Delivered</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: getProgressWidth(delivery.status) }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(true)
const searchQuery = ref('')

const filters = ref({
  status: '',
  carrier: ''
})

const stats = ref({
  totalShipments: 25,
  delivered: 18,
  inTransit: 5,
  delayed: 2
})

const deliveries = ref([
  {
    id: 1,
    trackingNumber: '1Z999AA1234567890',
    orderNumber: 'ORD-001',
    carrier: 'ups',
    status: 'in_transit',
    currentLocation: 'Distribution Center, Chicago',
    shippedDate: new Date('2024-01-15'),
    estimatedDelivery: new Date('2024-01-18')
  },
  {
    id: 2,
    trackingNumber: 'FX1234567890',
    orderNumber: 'ORD-002',
    carrier: 'fedex',
    status: 'out_for_delivery',
    currentLocation: 'Out for delivery',
    shippedDate: new Date('2024-01-14'),
    estimatedDelivery: new Date('2024-01-16')
  },
  {
    id: 3,
    trackingNumber: 'DH1234567890',
    orderNumber: 'ORD-003',
    carrier: 'dhl',
    status: 'delivered',
    currentLocation: 'Delivered',
    shippedDate: new Date('2024-01-12'),
    estimatedDelivery: new Date('2024-01-15')
  }
])

const fetchDeliveries = async () => {
  try {
    loading.value = true
    // Mock data - in real app, fetch from API
  } catch (error) {
    console.error('Error fetching deliveries:', error)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  fetchDeliveries()
}

const trackPackage = (trackingNumber: string) => {
  router.push(`/delivery/track/${trackingNumber}`)
}

const viewDetails = (delivery: any) => {
  console.log('View delivery details:', delivery)
}

const getCarrierIcon = (carrier: string) => {
  const icons: { [key: string]: string } = {
    ups: '/icons/ups.svg',
    fedex: '/icons/fedex.svg',
    dhl: '/icons/dhl.svg',
    usps: '/icons/usps.svg'
  }
  return icons[carrier] || '/icons/shipping.svg'
}

const getProgressWidth = (status: string) => {
  const progress: { [key: string]: string } = {
    shipped: '25%',
    in_transit: '50%',
    out_for_delivery: '75%',
    delivered: '100%',
    delayed: '50%'
  }
  return progress[status] || '0%'
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

onMounted(() => {
  fetchDeliveries()
})
</script>

