<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Reports</h1>
        <button
          @click="generateReport"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Generate Report
        </button>
      </div>

      <!-- Report Filters -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Report Configuration</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              v-model="reportConfig.type"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="sales">Sales Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="customer">Customer Report</option>
              <option value="financial">Financial Report</option>
              <option value="product">Product Performance</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Date Range</label>
            <select
              v-model="reportConfig.dateRange"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Format</label>
            <select
              v-model="reportConfig.format"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>

        <!-- Custom Date Range -->
        <div v-if="reportConfig.dateRange === 'custom'" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              v-model="reportConfig.startDate"
              type="date"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">End Date</label>
            <input
              v-model="reportConfig.endDate"
              type="date"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <!-- Report Templates -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Sales Report</h3>
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p class="text-sm text-gray-600 mb-4">Comprehensive sales analysis including revenue, orders, and trends.</p>
          <button
            @click="selectReportTemplate('sales')"
            class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Generate Sales Report
          </button>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Inventory Report</h3>
            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p class="text-sm text-gray-600 mb-4">Stock levels, low inventory alerts, and product performance.</p>
          <button
            @click="selectReportTemplate('inventory')"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Generate Inventory Report
          </button>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Customer Report</h3>
            <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p class="text-sm text-gray-600 mb-4">Customer analytics, segmentation, and lifetime value analysis.</p>
          <button
            @click="selectReportTemplate('customer')"
            class="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Generate Customer Report
          </button>
        </div>
      </div>

      <!-- Recent Reports -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Reports</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Previously generated reports</p>
        </div>
        <ul class="divide-y divide-gray-200">
          <li v-for="report in recentReports" :key="report.id">
            <div class="px-4 py-4 flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ report.name }}</div>
                  <div class="text-sm text-gray-500">{{ report.type }} • {{ formatDate(report.createdAt) }}</div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusClass(report.status)">
                  {{ report.status }}
                </span>
                <button
                  @click="downloadReport(report)"
                  class="text-indigo-600 hover:text-indigo-900"
                  :disabled="report.status !== 'completed'"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '../../components/AdminLayout.vue'

const reportConfig = ref({
  type: 'sales',
  dateRange: '30',
  format: 'pdf',
  startDate: '',
  endDate: ''
})

const recentReports = ref([
  {
    id: 1,
    name: 'Sales Report - January 2024',
    type: 'Sales Report',
    status: 'completed',
    createdAt: new Date('2024-01-31'),
    format: 'pdf'
  },
  {
    id: 2,
    name: 'Inventory Report - January 2024',
    type: 'Inventory Report',
    status: 'processing',
    createdAt: new Date('2024-01-30'),
    format: 'excel'
  },
  {
    id: 3,
    name: 'Customer Report - Q4 2023',
    type: 'Customer Report',
    status: 'completed',
    createdAt: new Date('2024-01-15'),
    format: 'pdf'
  }
])

const generateReport = async () => {
  try {
    console.log('Generating report with config:', reportConfig.value)
    // In real app, call API to generate report
    alert('Report generation started. You will be notified when it\'s ready.')
  } catch (error) {
    console.error('Error generating report:', error)
  }
}

const selectReportTemplate = (type: string) => {
  reportConfig.value.type = type
  generateReport()
}

const downloadReport = (report: any) => {
  console.log('Downloading report:', report.name)
  // In real app, download the report file
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

onMounted(() => {
  // Initialize default dates
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  reportConfig.value.endDate = today.toISOString().split('T')[0]
  reportConfig.value.startDate = thirtyDaysAgo.toISOString().split('T')[0]
})
</script>

