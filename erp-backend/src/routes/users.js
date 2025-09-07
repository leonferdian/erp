import express from 'express'
import User from '../models/User.js'
import { auth, adminAuth } from '../middleware/auth.js'

const router = express.Router()

// Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      search,
      isActive
    } = req.query

    const query = {}

    if (role) query.role = role
    if (isActive !== undefined) query.isActive = isActive === 'true'
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ]
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single user (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create user (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, phone, address } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || 'customer',
      phone,
      address
    })

    await user.save()

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        address: user.address,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Create user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update user (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { firstName, lastName, role, phone, address, preferences, isActive } = req.body

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update fields
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (role) user.role = role
    if (phone) user.phone = phone
    if (address) user.address = address
    if (preferences) user.preferences = { ...user.preferences, ...preferences }
    if (isActive !== undefined) user.isActive = isActive

    await user.save()

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        address: user.address,
        preferences: user.preferences,
        isActive: user.isActive,
        updatedAt: user.updatedAt
      }
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete user (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Soft delete - deactivate user
    user.isActive = false
    await user.save()

    res.json({ message: 'User deactivated successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user statistics (admin only)
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          roleCounts: {
            $push: '$role'
          }
        }
      }
    ])

    // Calculate role distribution
    const roleDistribution = {}
    if (stats.length > 0) {
      stats[0].roleCounts.forEach(role => {
        roleDistribution[role] = (roleDistribution[role] || 0) + 1
      })
    }

    res.json({
      stats: stats[0] || {
        totalUsers: 0,
        activeUsers: 0
      },
      roleDistribution
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
