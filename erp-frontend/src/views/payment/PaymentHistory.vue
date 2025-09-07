<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Payment History</h1>
      <p class="mt-2 text-gray-600">View all your payment transactions and history</p>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Date Range</label>
          <select
            v-model="filters.dateRange"
            @change="applyFilters"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
            <option value="all">All time</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            v-model="filters.method"
            @change="applyFilters"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Methods</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="paypal">PayPal</option>
            <option value="stripe">Stripe</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Paid</p>
            <p class="text-2xl font-semibold text-gray-900">${{ summary.totalPaid.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Transactions</p>
            <p class="text-2xl font-semibold text-gray-900">{{ summary.totalTransactions }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Refunded Amount</p>
            <p class="text-2xl font-semibold text-gray-900">${{ summary.refundedAmount.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment History Table -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="payments.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
        <p class="mt-1 text-sm text-gray-500">No payment transactions match your current filters.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="payment in payments" :key="payment.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ payment.transactionId }}</div>
                  <div class="text-sm text-gray-500">{{ payment.orderNumber }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(payment.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-6 w-6">
                    <img
                      :src="getPaymentMethodIcon(payment.method)"
                      :alt="payment.method"
                      class="h-6 w-6"
                    />
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ formatPaymentMethod(payment.method) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${{ payment.amount.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(payment.status)"
                >
                  {{ payment.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewDetails(payment)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  View Details
                </button>
                <button
                  v-if="payment.status === 'completed'"
                  @click="downloadReceipt(payment)"
                  class="text-green-600 hover:text-green-900"
                >
                  Receipt
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="payments.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span>
              of
              <span class="font-medium">{{ totalItems }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const totalPages = ref(0)

const filters = ref({
  dateRange: '30',
  status: '',
  method: ''
})

const summary = ref({
  totalPaid: 2500,
  totalTransactions: 15,
  refundedAmount: 150
})

const payments = ref([
  {
    id: 1,
    transactionId: 'txn_123456789',
    orderNumber: 'ORD-001',
    date: new Date('2024-01-15'),
    method: 'credit_card',
    amount: 99.99,
    status: 'completed'
  },
  {
    id: 2,
    transactionId: 'txn_987654321',
    orderNumber: 'ORD-002',
    date: new Date('2024-01-14'),
    method: 'paypal',
    amount: 149.99,
    status: 'completed'
  },
  {
    id: 3,
    transactionId: 'txn_456789123',
    orderNumber: 'ORD-003',
    date: new Date('2024-01-13'),
    method: 'stripe',
    amount: 79.99,
    status: 'refunded'
  }
])

const fetchPayments = async () => {
  try {
    loading.value = true
    // Mock data - in real app, fetch from API
    totalItems.value = payments.value.length
    totalPages.value = Math.ceil(totalItems.value / pageSize.value)
  } catch (error) {
    console.error('Error fetching payments:', error)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  fetchPayments()
}

const clearFilters = () => {
  filters.value = {
    dateRange: '30',
    status: '',
    method: ''
  }
  fetchPayments()
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchPayments()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchPayments()
  }
}

const viewDetails = (payment: any) => {
  console.log('View payment details:', payment)
}

const downloadReceipt = (payment: any) => {
  console.log('Download receipt for:', payment.transactionId)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatPaymentMethod = (method: string) => {
  return method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getPaymentMethodIcon = (method: string) => {
  const icons: { [key: string]: string } = {
    credit_card: '/icons/credit-card.svg',
    debit_card: '/icons/debit-card.svg',
    paypal: '/icons/paypal.svg',
    stripe: '/icons/stripe.svg',
    bank_transfer: '/icons/bank.svg'
  }
  return icons[method] || '/icons/payment.svg'
}

const getStatusClass = (status: string) => {
  const classes: { [key: string]: string } = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  fetchPayments()
})
</script>

