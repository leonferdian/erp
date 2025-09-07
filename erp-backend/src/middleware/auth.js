import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    const user = await User.findById(decoded.userId).select('-password')
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' })
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' })
    }

    req.userId = user._id
    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({ message: 'Token is not valid' })
  }
}

// Admin authorization middleware
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' })
      }
      next()
    })
  } catch (error) {
    res.status(401).json({ message: 'Authorization failed' })
  }
}

// Customer authorization middleware
const customerAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (!['customer', 'user'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Customer access required' })
      }
      next()
    })
  } catch (error) {
    res.status(401).json({ message: 'Authorization failed' })
  }
}

export { auth, adminAuth, customerAuth }
