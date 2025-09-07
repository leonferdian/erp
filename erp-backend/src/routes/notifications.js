import express from 'express'
import { auth, adminAuth } from '../middleware/auth.js'

const router = express.Router()

// Get notifications
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, category, unread } = req.query

    // In a real application, you would have a Notification model
    // For now, we'll simulate notifications
    const notifications = await getNotifications(req.userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      unread: unread === 'true'
    })

    res.json(notifications)
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const { id } = req.params

    // In a real application, you would update the notification in the database
    const success = await markNotificationAsRead(id, req.userId)

    if (success) {
      res.json({ message: 'Notification marked as read' })
    } else {
      res.status(404).json({ message: 'Notification not found' })
    }
  } catch (error) {
    console.error('Mark notification as read error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await markAllNotificationsAsRead(req.userId)
    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    console.error('Mark all notifications as read error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params

    const success = await deleteNotification(id, req.userId)

    if (success) {
      res.json({ message: 'Notification deleted' })
    } else {
      res.status(404).json({ message: 'Notification not found' })
    }
  } catch (error) {
    console.error('Delete notification error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Send notification (admin only)
router.post('/send', adminAuth, async (req, res) => {
  try {
    const { userIds, title, message, type, category, actionUrl, actionText } = req.body

    const notification = {
      title,
      message,
      type: type || 'info',
      category: category || 'system',
      actionUrl,
      actionText,
      timestamp: new Date()
    }

    // Send to specific users or broadcast
    if (userIds && userIds.length > 0) {
      await sendNotificationToUsers(userIds, notification)
    } else {
      await broadcastNotification(notification)
    }

    res.json({ message: 'Notification sent successfully' })
  } catch (error) {
    console.error('Send notification error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get notification statistics (admin only)
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const stats = await getNotificationStats()
    res.json(stats)
  } catch (error) {
    console.error('Get notification stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Simulate getting notifications
async function getNotifications(userId, options) {
  // In a real application, this would query a Notification collection
  const mockNotifications = [
    {
      id: '1',
      title: 'Order Shipped',
      message: 'Your order #ORD-123 has been shipped',
      type: 'info',
      category: 'order',
      read: false,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      actionUrl: '/orders/123',
      actionText: 'View Order'
    },
    {
      id: '2',
      title: 'Payment Successful',
      message: 'Your payment of $99.99 has been processed',
      type: 'success',
      category: 'payment',
      read: true,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      actionUrl: '/orders/123',
      actionText: 'View Order'
    },
    {
      id: '3',
      title: 'New Product Available',
      message: 'Check out our latest product: Wireless Headphones',
      type: 'info',
      category: 'promotion',
      read: false,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      actionUrl: '/products/wireless-headphones',
      actionText: 'View Product'
    }
  ]

  // Apply filters
  let filtered = mockNotifications

  if (options.category) {
    filtered = filtered.filter(n => n.category === options.category)
  }

  if (options.unread) {
    filtered = filtered.filter(n => !n.read)
  }

  // Apply pagination
  const start = (options.page - 1) * options.limit
  const end = start + options.limit
  const paginated = filtered.slice(start, end)

  return {
    notifications: paginated,
    pagination: {
      current: options.page,
      pages: Math.ceil(filtered.length / options.limit),
      total: filtered.length
    },
    unreadCount: mockNotifications.filter(n => !n.read).length
  }
}

// Simulate marking notification as read
async function markNotificationAsRead(notificationId, userId) {
  // In a real application, this would update the database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true) // Simulate success
    }, 100)
  })
}

// Simulate marking all notifications as read
async function markAllNotificationsAsRead(userId) {
  // In a real application, this would update the database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true) // Simulate success
    }, 100)
  })
}

// Simulate deleting notification
async function deleteNotification(notificationId, userId) {
  // In a real application, this would delete from the database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true) // Simulate success
    }, 100)
  })
}

// Simulate sending notification to specific users
async function sendNotificationToUsers(userIds, notification) {
  // In a real application, this would save notifications to the database
  // and potentially send push notifications, emails, etc.
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Sending notification to users: ${userIds.join(', ')}`)
      resolve(true)
    }, 200)
  })
}

// Simulate broadcasting notification
async function broadcastNotification(notification) {
  // In a real application, this would save notifications for all users
  // and potentially send push notifications, emails, etc.
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Broadcasting notification to all users')
      resolve(true)
    }, 200)
  })
}

// Simulate getting notification statistics
async function getNotificationStats() {
  // In a real application, this would query the database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalNotifications: 1250,
        unreadNotifications: 45,
        notificationsByType: {
          info: 800,
          success: 300,
          warning: 100,
          error: 50
        },
        notificationsByCategory: {
          order: 600,
          payment: 300,
          delivery: 200,
          system: 100,
          promotion: 50
        }
      })
    }, 100)
  })
}

export default router
