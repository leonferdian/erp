import express from 'express'
import Order from '../models/Order.js'
import { auth, adminAuth, customerAuth } from '../middleware/auth.js'

const router = express.Router()

// Get delivery tracking info
router.get('/track/:trackingNumber', auth, async (req, res) => {
  try {
    const { trackingNumber } = req.params

    const order = await Order.findOne({ 'shipping.trackingNumber': trackingNumber })
      .populate('customer', 'firstName lastName email')
      .populate('items.product', 'name images')

    if (!order) {
      return res.status(404).json({ message: 'Tracking number not found' })
    }

    // Check if user can access this order
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // Get delivery status from external API (simulated)
    const deliveryStatus = await getDeliveryStatus(trackingNumber)

    res.json({
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        shipping: order.shipping,
        items: order.items,
        customer: order.customer
      },
      tracking: deliveryStatus
    })
  } catch (error) {
    console.error('Get delivery tracking error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get all deliveries (admin) or user's deliveries (customer)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query

    const query = {
      'shipping.trackingNumber': { $exists: true, $ne: null }
    }

    // Admin can see all deliveries, customers only their own
    if (req.user.role === 'admin') {
      if (status) query.status = status
    } else {
      query.customer = req.userId
      if (status) query.status = status
    }

    const orders = await Order.find(query)
      .populate('customer', 'firstName lastName email')
      .populate('items.product', 'name images')
      .select('orderNumber status shipping customer items createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments(query)

    res.json({
      deliveries: orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Get deliveries error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update delivery status (admin only)
router.put('/:orderId/status', adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params
    const { status, location, note } = req.body

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (!order.shipping.trackingNumber) {
      return res.status(400).json({ message: 'Order has no tracking number' })
    }

    // Update order status based on delivery status
    let orderStatus = order.status
    if (status === 'in_transit') {
      orderStatus = 'shipped'
    } else if (status === 'delivered') {
      orderStatus = 'delivered'
      order.shipping.deliveredAt = new Date()
    } else if (status === 'failed') {
      orderStatus = 'cancelled'
    }

    order.status = orderStatus
    order.addTimelineEntry(`delivery_${status}`, note || `Delivery status: ${status}`, req.userId)

    await order.save()

    // Update external delivery system (simulated)
    await updateDeliveryStatus(order.shipping.trackingNumber, status, location, note)

    res.json({
      message: 'Delivery status updated successfully',
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        shipping: order.shipping
      }
    })
  } catch (error) {
    console.error('Update delivery status error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create shipping label (admin only)
router.post('/:orderId/ship', adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params
    const { carrier, method } = req.body

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.status !== 'confirmed' && order.status !== 'processing') {
      return res.status(400).json({ message: 'Order is not ready for shipping' })
    }

    // Generate tracking number
    const trackingNumber = generateTrackingNumber(carrier)

    // Create shipping label (simulated)
    const shippingLabel = await createShippingLabel({
      orderId: order._id,
      trackingNumber,
      carrier,
      method,
      shippingAddress: order.shippingAddress,
      items: order.items
    })

    if (shippingLabel.success) {
      // Update order
      order.shipping.trackingNumber = trackingNumber
      order.shipping.carrier = carrier
      order.shipping.method = method
      order.status = 'shipped'
      order.shipping.shippedAt = new Date()

      order.addTimelineEntry('shipped', `Order shipped via ${carrier}`, req.userId)
      await order.save()

      res.json({
        message: 'Shipping label created successfully',
        tracking: {
          orderNumber: order.orderNumber,
          trackingNumber,
          carrier,
          method,
          labelUrl: shippingLabel.labelUrl,
          estimatedDelivery: shippingLabel.estimatedDelivery
        }
      })
    } else {
      res.status(400).json({
        message: 'Failed to create shipping label',
        error: shippingLabel.error
      })
    }
  } catch (error) {
    console.error('Create shipping label error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get delivery analytics (admin only)
router.get('/admin/analytics', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const matchQuery = {
      'shipping.trackingNumber': { $exists: true, $ne: null }
    }

    if (startDate || endDate) {
      matchQuery.createdAt = {}
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate)
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate)
    }

    const analytics = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalShipments: { $sum: 1 },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          inTransitOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
          },
          carrierCounts: {
            $push: '$shipping.carrier'
          },
          statusCounts: {
            $push: '$status'
          }
        }
      }
    ])

    // Calculate carrier distribution
    const carrierDistribution = {}
    if (analytics.length > 0) {
      analytics[0].carrierCounts.forEach(carrier => {
        if (carrier) {
          carrierDistribution[carrier] = (carrierDistribution[carrier] || 0) + 1
        }
      })
    }

    // Calculate status distribution
    const statusDistribution = {}
    if (analytics.length > 0) {
      analytics[0].statusCounts.forEach(status => {
        statusDistribution[status] = (statusDistribution[status] || 0) + 1
      })
    }

    res.json({
      analytics: analytics[0] || {
        totalShipments: 0,
        deliveredOrders: 0,
        inTransitOrders: 0
      },
      carrierDistribution,
      statusDistribution
    })
  } catch (error) {
    console.error('Get delivery analytics error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Simulate getting delivery status from external API
async function getDeliveryStatus(trackingNumber) {
  // This simulates integration with delivery APIs like UPS, FedEx, DHL, etc.
  return new Promise((resolve) => {
    setTimeout(() => {
      const statuses = ['in_transit', 'out_for_delivery', 'delivered', 'exception']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

      resolve({
        trackingNumber,
        status: randomStatus,
        location: randomStatus === 'delivered' ? 'Delivered' : 'In Transit',
        estimatedDelivery: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        timeline: [
          {
            status: 'shipped',
            location: 'Warehouse',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            note: 'Package shipped from warehouse'
          },
          {
            status: 'in_transit',
            location: 'Distribution Center',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            note: 'Package in transit'
          }
        ]
      })
    }, 500)
  })
}

// Simulate updating delivery status in external system
async function updateDeliveryStatus(trackingNumber, status, location, note) {
  // This would update the external delivery system
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true })
    }, 200)
  })
}

// Generate tracking number
function generateTrackingNumber(carrier) {
  const prefixes = {
    'ups': '1Z',
    'fedex': 'FX',
    'dhl': 'DH',
    'usps': 'US'
  }
  
  const prefix = prefixes[carrier.toLowerCase()] || 'TR'
  const random = Math.random().toString(36).substr(2, 12).toUpperCase()
  return `${prefix}${random}`
}

// Simulate creating shipping label
async function createShippingLabel({ orderId, trackingNumber, carrier, method, shippingAddress, items }) {
  // This simulates integration with shipping providers
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.05 // 95% success rate
      
      if (success) {
        resolve({
          success: true,
          labelUrl: `https://shipping-labels.example.com/${trackingNumber}.pdf`,
          estimatedDelivery: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
        })
      } else {
        resolve({
          success: false,
          error: 'Failed to create shipping label. Please try again.'
        })
      }
    }, 1000)
  })
}

export default router
