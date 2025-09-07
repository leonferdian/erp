import { ref } from 'vue'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timestamp: Date
  read: boolean
  category?: 'order' | 'payment' | 'delivery' | 'system' | 'promotion'
  actionUrl?: string
  actionText?: string
}

class NotificationService {
  private notifications = ref<Notification[]>([])
  private unreadCount = ref(0)
  private ws: WebSocket | null = null

  constructor() {
    this.loadNotifications()
    this.connectWebSocket()
  }

  // Get all notifications
  public get allNotifications() {
    return this.notifications.value
  }

  // Get unread count
  public get unreadNotificationsCount() {
    return this.unreadCount.value
  }

  // Get notifications by category
  public getNotificationsByCategory(category: string) {
    return this.notifications.value.filter(n => n.category === category)
  }

  // Add notification
  public addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    }

    this.notifications.value.unshift(newNotification)
    this.unreadCount.value++
    this.saveNotifications()

    // Auto-remove after 5 seconds for non-persistent notifications
    if (notification.type !== 'error') {
      setTimeout(() => {
        this.removeNotification(newNotification.id)
      }, 5000)
    }
  }

  // Mark notification as read
  public markAsRead(id: string) {
    const notification = this.notifications.value.find(n => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      this.unreadCount.value--
      this.saveNotifications()
    }
  }

  // Mark all as read
  public markAllAsRead() {
    this.notifications.value.forEach(n => {
      if (!n.read) {
        n.read = true
      }
    })
    this.unreadCount.value = 0
    this.saveNotifications()
  }

  // Remove notification
  public removeNotification(id: string) {
    const index = this.notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      const notification = this.notifications.value[index]
      if (!notification.read) {
        this.unreadCount.value--
      }
      this.notifications.value.splice(index, 1)
      this.saveNotifications()
    }
  }

  // Clear all notifications
  public clearAll() {
    this.notifications.value = []
    this.unreadCount.value = 0
    this.saveNotifications()
  }

  // WebSocket connection for real-time notifications
  private connectWebSocket() {
    if (typeof window === 'undefined') return

    const wsUrl = import.meta.env.VITE_WS_URL || ''
    if (!wsUrl) {
      console.log('WebSocket disabled - no WS_URL configured')
      return
    }

    try {
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('WebSocket connected')
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'notification') {
            this.addNotification(data.notification)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        // Only reconnect if WS_URL is still configured
        if (wsUrl) {
          setTimeout(() => this.connectWebSocket(), 5000)
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }
  }

  // Load notifications from localStorage
  private loadNotifications() {
    try {
      const saved = localStorage.getItem('notifications')
      if (saved) {
        const parsed = JSON.parse(saved)
        this.notifications.value = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }))
        this.unreadCount.value = this.notifications.value.filter(n => !n.read).length
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  // Save notifications to localStorage
  private saveNotifications() {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications.value))
    } catch (error) {
      console.error('Error saving notifications:', error)
    }
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Convenience methods for different notification types
  public success(title: string, message: string, options?: Partial<Notification>) {
    this.addNotification({ title, message, type: 'success', ...options })
  }

  public error(title: string, message: string, options?: Partial<Notification>) {
    this.addNotification({ title, message, type: 'error', ...options })
  }

  public warning(title: string, message: string, options?: Partial<Notification>) {
    this.addNotification({ title, message, type: 'warning', ...options })
  }

  public info(title: string, message: string, options?: Partial<Notification>) {
    this.addNotification({ title, message, type: 'info', ...options })
  }

  // Order-related notifications
  public orderCreated(orderId: string) {
    this.addNotification({
      title: 'Order Created',
      message: `Your order #${orderId} has been created successfully.`,
      type: 'success',
      category: 'order',
      actionUrl: `/orders/${orderId}`,
      actionText: 'View Order'
    })
  }

  public orderStatusUpdated(orderId: string, status: string) {
    this.addNotification({
      title: 'Order Status Updated',
      message: `Your order #${orderId} status has been updated to ${status}.`,
      type: 'info',
      category: 'order',
      actionUrl: `/orders/${orderId}`,
      actionText: 'View Order'
    })
  }

  // Payment-related notifications
  public paymentSuccess(amount: number, orderId: string) {
    this.addNotification({
      title: 'Payment Successful',
      message: `Payment of $${amount} for order #${orderId} has been processed.`,
      type: 'success',
      category: 'payment',
      actionUrl: `/orders/${orderId}`,
      actionText: 'View Order'
    })
  }

  public paymentFailed(orderId: string) {
    this.addNotification({
      title: 'Payment Failed',
      message: `Payment for order #${orderId} could not be processed. Please try again.`,
      type: 'error',
      category: 'payment',
      actionUrl: `/orders/${orderId}`,
      actionText: 'Retry Payment'
    })
  }

  // Delivery-related notifications
  public deliveryShipped(_trackingNumber: string) {
    this.addNotification({
      title: 'Order Shipped',
      message: `Your order has been shipped. Tracking number: ${_trackingNumber}`,
      type: 'info',
      category: 'delivery',
      actionUrl: `/delivery/track/${_trackingNumber}`,
      actionText: 'Track Package'
    })
  }

  public deliveryDelivered(_trackingNumber: string) {
    this.addNotification({
      title: 'Order Delivered',
      message: `Your order has been delivered successfully.`,
      type: 'success',
      category: 'delivery',
      actionUrl: `/orders`,
      actionText: 'View Orders'
    })
  }

  // Cleanup
  public destroy() {
    if (this.ws) {
      this.ws.close()
    }
  }
}

export const notificationService = new NotificationService()
