import express from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { auth, adminAuth } from '../middleware/auth.js'

const router = express.Router()

// Get dashboard analytics (admin only)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const dateFilter = {}
    if (startDate || endDate) {
      dateFilter.createdAt = {}
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate)
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate)
    }

    // Get various analytics in parallel
    const [
      orderStats,
      revenueStats,
      userStats,
      productStats,
      topProducts,
      recentOrders
    ] = await Promise.all([
      getOrderStats(dateFilter),
      getRevenueStats(dateFilter),
      getUserStats(dateFilter),
      getProductStats(),
      getTopProducts(dateFilter),
      getRecentOrders(dateFilter)
    ])

    res.json({
      orderStats,
      revenueStats,
      userStats,
      productStats,
      topProducts,
      recentOrders
    })
  } catch (error) {
    console.error('Get dashboard analytics error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get sales analytics
router.get('/sales', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query

    const dateFilter = {}
    if (startDate || endDate) {
      dateFilter.createdAt = {}
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate)
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate)
    }

    const salesData = await getSalesAnalytics(dateFilter, groupBy)
    res.json(salesData)
  } catch (error) {
    console.error('Get sales analytics error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get customer analytics
router.get('/customers', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const dateFilter = {}
    if (startDate || endDate) {
      dateFilter.createdAt = {}
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate)
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate)
    }

    const customerData = await getCustomerAnalytics(dateFilter)
    res.json(customerData)
  } catch (error) {
    console.error('Get customer analytics error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get product analytics
router.get('/products', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const dateFilter = {}
    if (startDate || endDate) {
      dateFilter.createdAt = {}
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate)
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate)
    }

    const productData = await getProductAnalytics(dateFilter)
    res.json(productData)
  } catch (error) {
    console.error('Get product analytics error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Helper functions for analytics

async function getOrderStats(dateFilter) {
  const stats = await Order.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        },
        averageOrderValue: { $avg: '$pricing.total' }
      }
    }
  ])

  return stats[0] || {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    averageOrderValue: 0
  }
}

async function getRevenueStats(dateFilter) {
  const stats = await Order.aggregate([
    { 
      $match: { 
        ...dateFilter,
        paymentStatus: 'paid'
      } 
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$pricing.total' },
        totalTax: { $sum: '$pricing.tax' },
        totalShipping: { $sum: '$pricing.shipping' },
        totalDiscount: { $sum: '$pricing.discount' }
      }
    }
  ])

  return stats[0] || {
    totalRevenue: 0,
    totalTax: 0,
    totalShipping: 0,
    totalDiscount: 0
  }
}

async function getUserStats(dateFilter) {
  const stats = await User.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: ['$isActive', 1, 0] }
        },
        newUsers: {
          $sum: { $cond: [{ $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] }, 1, 0] }
        }
      }
    }
  ])

  return stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0
  }
}

async function getProductStats() {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        activeProducts: {
          $sum: { $cond: ['$isActive', 1, 0] }
        },
        featuredProducts: {
          $sum: { $cond: ['$isFeatured', 1, 0] }
        },
        lowStockProducts: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$inventory.trackInventory', true] },
                  { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ])

  return stats[0] || {
    totalProducts: 0,
    activeProducts: 0,
    featuredProducts: 0,
    lowStockProducts: 0
  }
}

async function getTopProducts(dateFilter) {
  const topProducts = await Order.aggregate([
    { $match: dateFilter },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.total' }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        productId: '$_id',
        productName: '$product.name',
        productImage: { $arrayElemAt: ['$product.images.url', 0] },
        totalSold: 1,
        totalRevenue: 1
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 }
  ])

  return topProducts
}

async function getRecentOrders(dateFilter) {
  const recentOrders = await Order.find(dateFilter)
    .populate('customer', 'firstName lastName email')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .limit(10)
    .select('orderNumber customer items pricing.total status createdAt')

  return recentOrders
}

async function getSalesAnalytics(dateFilter, groupBy) {
  let groupFormat
  switch (groupBy) {
    case 'hour':
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
        hour: { $hour: '$createdAt' }
      }
      break
    case 'day':
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      }
      break
    case 'month':
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      }
      break
    case 'year':
      groupFormat = {
        year: { $year: '$createdAt' }
      }
      break
    default:
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      }
  }

  const salesData = await Order.aggregate([
    { 
      $match: { 
        ...dateFilter,
        paymentStatus: 'paid'
      } 
    },
    {
      $group: {
        _id: groupFormat,
        totalSales: { $sum: '$pricing.total' },
        orderCount: { $sum: 1 },
        averageOrderValue: { $avg: '$pricing.total' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } }
  ])

  return salesData
}

async function getCustomerAnalytics(dateFilter) {
  const customerData = await Order.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$customer',
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'customer'
      }
    },
    { $unwind: '$customer' },
    {
      $project: {
        customerId: '$_id',
        customerName: { $concat: ['$customer.firstName', ' ', '$customer.lastName'] },
        customerEmail: '$customer.email',
        totalOrders: 1,
        totalSpent: 1,
        averageOrderValue: 1
      }
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 20 }
  ])

  return customerData
}

async function getProductAnalytics(dateFilter) {
  const productData = await Order.aggregate([
    { $match: dateFilter },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.total' },
        averagePrice: { $avg: '$items.price' }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        productId: '$_id',
        productName: '$product.name',
        productCategory: '$product.category',
        totalSold: 1,
        totalRevenue: 1,
        averagePrice: 1
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 50 }
  ])

  return productData
}

export default router
