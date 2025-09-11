import express from 'express'
import Order from '../models/Order.js'
import { auth, adminAuth, customerAuth } from '../middleware/auth.js'

const router = express.Router()

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query

    const query = {}

    // Admin can see all payments, customers only their own
    if (req.user.role === 'admin') {
      if (status) query.paymentStatus = status
    } else {
      query.customer = req.userId
      if (status) query.paymentStatus = status
    }

    const orders = await Order.find(query)
      .populate('customer', 'firstName lastName email')
      .select('orderNumber paymentStatus payment pricing.total createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments(query)

    res.json({
      payments: orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Get payment history error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Process payment (customer)
router.post('/process', customerAuth, async (req, res) => {
  try {
    const { orderId, paymentMethod, paymentData } = req.body

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Check if order belongs to user
    if (order.customer.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // Check if order can be paid
    if (order.paymentStatus !== 'pending') {
      return res.status(400).json({ message: 'Order payment already processed' })
    }

    // Simulate payment processing
    // In a real application, you would integrate with payment providers like Stripe, PayPal, etc.
    const paymentResult = await processPayment({
      amount: order.pricing.total,
      method: paymentMethod,
      data: paymentData,
      orderId: order._id
    })

    if (paymentResult.success) {
      // Update order payment status
      order.paymentStatus = 'paid'
      order.payment.transactionId = paymentResult.transactionId
      order.payment.paymentIntentId = paymentResult.paymentIntentId
      order.payment.paidAt = new Date()

      order.addTimelineEntry('payment_paid', 'Payment processed successfully', req.userId)
      await order.save()

      res.json({
        message: 'Payment processed successfully',
        payment: {
          orderId: order._id,
          transactionId: paymentResult.transactionId,
          amount: order.pricing.total,
          status: 'paid',
          paidAt: order.payment.paidAt
        }
      })
    } else {
      // Payment failed
      order.paymentStatus = 'failed'
      order.addTimelineEntry('payment_failed', paymentResult.error, req.userId)
      await order.save()

      res.status(400).json({
        message: 'Payment failed',
        error: paymentResult.error
      })
    }
  } catch (error) {
    console.error('Process payment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Refund payment (admin only)
router.post('/refund', adminAuth, async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Order is not paid' })
    }

    const refundAmount = amount || order.pricing.total

    // Simulate refund processing
    const refundResult = await processRefund({
      transactionId: order.payment.transactionId,
      amount: refundAmount,
      reason
    })

    if (refundResult.success) {
      // Update order
      order.paymentStatus = refundAmount === order.pricing.total ? 'refunded' : 'partially_refunded'
      order.payment.refundedAt = new Date()
      order.payment.refundAmount = refundAmount

      order.addTimelineEntry('payment_refunded', `Refund processed: $${refundAmount}`, req.userId)
      await order.save()

      res.json({
        message: 'Refund processed successfully',
        refund: {
          orderId: order._id,
          amount: refundAmount,
          transactionId: refundResult.transactionId,
          refundedAt: order.payment.refundedAt
        }
      })
    } else {
      res.status(400).json({
        message: 'Refund failed',
        error: refundResult.error
      })
    }
  } catch (error) {
    console.error('Process refund error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get payment analytics (admin only)
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
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$pricing.total', 0]
            }
          },
          totalRefunds: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'refunded'] }, '$pricing.total', 0]
            }
          },
          paymentMethodCounts: {
            $push: '$payment.method'
          },
          paymentStatusCounts: {
            $push: '$paymentStatus'
          }
        }
      }
    ])

    // Calculate payment method distribution
    const paymentMethodDistribution = {}
    if (analytics.length > 0) {
      analytics[0].paymentMethodCounts.forEach(method => {
        paymentMethodDistribution[method] = (paymentMethodDistribution[method] || 0) + 1
      })
    }

    // Calculate payment status distribution
    const paymentStatusDistribution = {}
    if (analytics.length > 0) {
      analytics[0].paymentStatusCounts.forEach(status => {
        paymentStatusDistribution[status] = (paymentStatusDistribution[status] || 0) + 1
      })
    }

    res.json({
      analytics: analytics[0] || {
        totalRevenue: 0,
        totalRefunds: 0
      },
      paymentMethodDistribution,
      paymentStatusDistribution
    })
  } catch (error) {
    console.error('Get payment analytics error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Simulate payment processing
async function processPayment({ amount, method, data, orderId }) {
  // This is a simulation - in a real app, you would integrate with actual payment providers
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 95% success rate
      const success = Math.random() > 0.05
      
      if (success) {
        resolve({
          success: true,
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          paymentIntentId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
      } else {
        resolve({
          success: false,
          error: 'Payment processing failed. Please try again.'
        })
      }
    }, 1000)
  })
}

// Simulate refund processing
async function processRefund({ transactionId, amount, reason }) {
  // This is a simulation - in a real app, you would integrate with actual payment providers
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 98% success rate
      const success = Math.random() > 0.02
      
      if (success) {
        resolve({
          success: true,
          transactionId: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
      } else {
        resolve({
          success: false,
          error: 'Refund processing failed. Please contact support.'
        })
      }
    }, 1000)
  })
}

export default router
