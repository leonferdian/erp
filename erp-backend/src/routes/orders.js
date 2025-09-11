import express from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { auth, adminAuth, customerAuth } from '../middleware/auth.js'

const router = express.Router()

// Get all orders (admin) or user's orders (customer)
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      startDate,
      endDate
    } = req.query

    const query = {}

    // Admin can see all orders, customers only their own
    if (req.user.role === 'admin') {
      // Admin filters
      if (status) query.status = status
      if (paymentStatus) query.paymentStatus = paymentStatus
    } else {
      // Customer can only see their own orders
      query.customer = req.userId
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }

    const orders = await Order.find(query)
      .populate('customer', 'firstName lastName email')
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments(query)

    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'firstName lastName email phone')
      .populate('items.product', 'name images price sku')
      .populate('timeline.updatedBy', 'firstName lastName')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Check if user can access this order
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json({ order })
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create order (customer)
router.post('/', customerAuth, async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod } = req.body

    // Validate items and calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product ${item.product} not found` })
      }

      if (product.inventory.trackInventory && product.inventory.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.inventory.quantity}` 
        })
      }

      const itemTotal = product.price * item.quantity
      subtotal += itemTotal

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      })
    }

    // Calculate totals (simplified - you might want to add tax calculation)
    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const total = subtotal + tax + shipping

    // Create order
    const order = new Order({
      customer: req.userId,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      pricing: {
        subtotal,
        tax,
        shipping,
        total
      },
      payment: {
        method: paymentMethod
      }
    })

    // Add initial timeline entry
    order.addTimelineEntry('pending', 'Order created', req.userId)

    await order.save()

    // Update product inventory
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'inventory.quantity': -item.quantity }
      })
    }

    // Populate the order for response
    await order.populate([
      { path: 'customer', select: 'firstName lastName email' },
      { path: 'items.product', select: 'name images price' }
    ])

    res.status(201).json({
      message: 'Order created successfully',
      order
    })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update order status (admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, note } = req.body

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.updateStatus(status, note, req.userId)
    await order.save()

    res.json({
      message: 'Order status updated successfully',
      order
    })
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update payment status (admin only)
router.put('/:id/payment', adminAuth, async (req, res) => {
  try {
    const { paymentStatus, transactionId, paymentIntentId, paidAt } = req.body

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.paymentStatus = paymentStatus
    if (transactionId) order.payment.transactionId = transactionId
    if (paymentIntentId) order.payment.paymentIntentId = paymentIntentId
    if (paidAt) order.payment.paidAt = new Date(paidAt)

    order.addTimelineEntry(`payment_${paymentStatus}`, 'Payment status updated', req.userId)
    await order.save()

    res.json({
      message: 'Payment status updated successfully',
      order
    })
  } catch (error) {
    console.error('Update payment status error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Add shipping information (admin only)
router.put('/:id/shipping', adminAuth, async (req, res) => {
  try {
    const { trackingNumber, carrier, method, estimatedDelivery } = req.body

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (trackingNumber) order.shipping.trackingNumber = trackingNumber
    if (carrier) order.shipping.carrier = carrier
    if (method) order.shipping.method = method
    if (estimatedDelivery) order.shipping.estimatedDelivery = new Date(estimatedDelivery)

    order.addTimelineEntry('shipped', 'Order shipped', req.userId)
    await order.save()

    res.json({
      message: 'Shipping information updated successfully',
      order
    })
  } catch (error) {
    console.error('Update shipping error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Cancel order (customer or admin)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Check if user can cancel this order
    if (req.user.role !== 'admin' && order.customer.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled' })
    }

    order.updateStatus('cancelled', reason || 'Order cancelled', req.userId)

    // Restore inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'inventory.quantity': item.quantity }
      })
    }

    await order.save()

    res.json({
      message: 'Order cancelled successfully',
      order
    })
  } catch (error) {
    console.error('Cancel order error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get order analytics (admin only)
router.get('/admin/analytics', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const matchQuery = {}
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
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.total' },
          averageOrderValue: { $avg: '$pricing.total' },
          statusCounts: {
            $push: '$status'
          }
        }
      }
    ])

    // Calculate status distribution
    const statusDistribution = {}
    if (analytics.length > 0) {
      analytics[0].statusCounts.forEach(status => {
        statusDistribution[status] = (statusDistribution[status] || 0) + 1
      })
    }

    res.json({
      analytics: analytics[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0
      },
      statusDistribution
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
