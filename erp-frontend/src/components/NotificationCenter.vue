<template>
  <div class="relative">
    <!-- Notification Bell -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.5 5.5L9 10l4.5-4.5L15 7l-6 6-6-6 1.5-1.5z" />
      </svg>
      
      <!-- Unread Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
    >
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Notifications</h3>
          <div class="flex space-x-2">
            <button
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              class="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Mark all read
            </button>
            <button
              @click="clearAll"
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
          No notifications
        </div>
        
        <div v-else>
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="p-4 border-b border-gray-100 hover:bg-gray-50"
            :class="{ 'bg-blue-50': !notification.read }"
          >
            <div class="flex items-start space-x-3">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <div
                  class="h-8 w-8 rounded-full flex items-center justify-center"
                  :class="getIconClass(notification.type)"
                >
                  <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="notification.type === 'success'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    <path v-else-if="notification.type === 'error'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    <path v-else-if="notification.type === 'warning'" fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    <path v-else fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500">{{ formatTime(notification.timestamp) }}</span>
                    <button
                      @click="removeNotification(notification.id)"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                
                <!-- Action Button -->
                <div v-if="notification.actionUrl && notification.actionText" class="mt-2">
                  <router-link
                    :to="notification.actionUrl"
                    @click="markAsRead(notification.id)"
                    class="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    {{ notification.actionText }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { notificationService } from '../services/notificationService'

const isOpen = ref(false)

const notifications = computed(() => notificationService.allNotifications)
const unreadCount = computed(() => notificationService.unreadNotificationsCount)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const markAsRead = (id: string) => {
  notificationService.markAsRead(id)
}

const markAllAsRead = () => {
  notificationService.markAllAsRead()
}

const removeNotification = (id: string) => {
  notificationService.removeNotification(id)
}

const clearAll = () => {
  notificationService.clearAll()
}

const getIconClass = (type: string) => {
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

const formatTime = (timestamp: Date) => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
