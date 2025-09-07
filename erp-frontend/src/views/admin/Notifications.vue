<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Notification Management</h1>
        <button
          @click="showSendModal = true"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Send Notification
        </button>
      </div>

      <!-- Notification Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.5 5.5L9 10l4.5-4.5L15 7l-6 6-6-6 1.5-1.5z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Notifications</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalNotifications }}</dd>
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
                  <dt class="text-sm font-medium text-gray-500 truncate">Unread</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.unreadNotifications }}</dd>
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
                  <dt class="text-sm font-medium text-gray-500 truncate">Sent Today</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.sentToday }}</dd>
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
                  <dt class="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.activeUsers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Send Notification Modal -->
      <div v-if="showSendModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Send Notification</h3>
            <form @submit.prevent="sendNotification">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Notification Type</label>
                  <select
                    v-model="notificationForm.type"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="info">Information</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    v-model="notificationForm.category"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="system">System</option>
                    <option value="order">Order</option>
                    <option value="payment">Payment</option>
                    <option value="delivery">Delivery</option>
                    <option value="promotion">Promotion</option>
                  </select>
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <input
                  v-model="notificationForm.title"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Notification title"
                />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  v-model="notificationForm.message"
                  rows="3"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Notification message"
                ></textarea>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Recipients</label>
                <div class="mt-2 space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="notificationForm.recipients"
                      type="radio"
                      value="all"
                      class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700">All Users</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="notificationForm.recipients"
                      type="radio"
                      value="customers"
                      class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700">Customers Only</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="notificationForm.recipients"
                      type="radio"
                      value="admins"
                      class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700">Admins Only</span>
                  </label>
                </div>
              </div>

              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="showSendModal = false"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Send Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Notifications</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">System and user notifications</p>
        </div>
        <ul class="divide-y divide-gray-200">
          <li v-for="notification in notifications" :key="notification.id">
            <div class="px-4 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center"
                         :class="getTypeClass(notification.type)">
                      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path v-if="notification.type === 'success'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        <path v-else-if="notification.type === 'error'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        <path v-else-if="notification.type === 'warning'" fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        <path v-else fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ notification.title }}</div>
                    <div class="text-sm text-gray-500">{{ notification.message }}</div>
                    <div class="text-xs text-gray-400 mt-1">
                      {{ formatDate(notification.timestamp) }} • {{ notification.category }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-gray-500">{{ notification.recipientCount }} recipients</span>
                  <button
                    @click="deleteNotification(notification.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
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

const showSendModal = ref(false)

const stats = ref({
  totalNotifications: 1250,
  unreadNotifications: 45,
  sentToday: 12,
  activeUsers: 89
})

const notificationForm = ref({
  type: 'info',
  category: 'system',
  title: '',
  message: '',
  recipients: 'all'
})

const notifications = ref([
  {
    id: 1,
    type: 'success',
    category: 'order',
    title: 'Order Completed',
    message: 'Order #12345 has been successfully delivered',
    timestamp: new Date('2024-01-15T10:30:00'),
    recipientCount: 1
  },
  {
    id: 2,
    type: 'warning',
    category: 'inventory',
    title: 'Low Stock Alert',
    message: 'Product "Wireless Headphones" is running low on stock',
    timestamp: new Date('2024-01-15T09:15:00'),
    recipientCount: 3
  },
  {
    id: 3,
    type: 'info',
    category: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2-4 AM',
    timestamp: new Date('2024-01-14T16:45:00'),
    recipientCount: 89
  }
])

const sendNotification = async () => {
  try {
    console.log('Sending notification:', notificationForm.value)
    // In real app, call API to send notification
    showSendModal.value = false
    notificationForm.value = {
      type: 'info',
      category: 'system',
      title: '',
      message: '',
      recipients: 'all'
    }
    alert('Notification sent successfully!')
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

const deleteNotification = (id: number) => {
  console.log('Deleting notification:', id)
  // In real app, call API to delete notification
}

const getTypeClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    case 'warning':
      return 'bg-yellow-500'
    default:
      return 'bg-blue-500'
  }
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

onMounted(() => {
  // Fetch notifications and stats
})
</script>

