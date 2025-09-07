import express from 'express'
import Product from '../models/Product.js'
import { auth, adminAuth } from '../middleware/auth.js'

const router = express.Router()

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sort = 'createdAt',
      order = 'desc',
      featured,
      inStock
    } = req.query

    const query = { isActive: true }

    // Apply filters
    if (category) query.category = category
    if (brand) query.brand = new RegExp(brand, 'i')
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseFloat(minPrice)
      if (maxPrice) query.price.$lte = parseFloat(maxPrice)
    }
    if (search) {
      query.$text = { $search: search }
    }
    if (featured === 'true') query.isFeatured = true
    if (inStock === 'true') {
      query['inventory.quantity'] = { $gt: 0 }
    }

    // Sort options
    const sortOptions = {}
    if (sort === 'price') {
      sortOptions.price = order === 'asc' ? 1 : -1
    } else if (sort === 'rating') {
      sortOptions['ratings.average'] = order === 'asc' ? 1 : -1
    } else {
      sortOptions[sort] = order === 'asc' ? 1 : -1
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-reviews')

    const total = await Product.countDocuments(query)

    res.json({
      products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('reviews.user', 'firstName lastName avatar')

    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ product })
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create product (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()

    res.status(201).json({
      message: 'Product created successfully',
      product
    })
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({
      message: 'Product updated successfully',
      product
    })
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Add review (authenticated users)
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, title, comment } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.userId.toString()
    )

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' })
    }

    // Add review
    product.reviews.push({
      user: req.userId,
      rating,
      title,
      comment
    })

    // Update average rating
    product.updateAverageRating()
    await product.save()

    res.status(201).json({
      message: 'Review added successfully',
      review: product.reviews[product.reviews.length - 1]
    })
  } catch (error) {
    console.error('Add review error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update inventory (admin only)
router.put('/:id/inventory', adminAuth, async (req, res) => {
  try {
    const { quantity, lowStockThreshold, trackInventory } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (quantity !== undefined) product.inventory.quantity = quantity
    if (lowStockThreshold !== undefined) product.inventory.lowStockThreshold = lowStockThreshold
    if (trackInventory !== undefined) product.inventory.trackInventory = trackInventory

    await product.save()

    res.json({
      message: 'Inventory updated successfully',
      inventory: product.inventory
    })
  } catch (error) {
    console.error('Update inventory error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get low stock products (admin only)
router.get('/admin/low-stock', adminAuth, async (req, res) => {
  try {
    const products = await Product.find({
      'inventory.trackInventory': true,
      $expr: {
        $lte: ['$inventory.quantity', '$inventory.lowStockThreshold']
      }
    }).select('name sku inventory')

    res.json({ products })
  } catch (error) {
    console.error('Get low stock error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
