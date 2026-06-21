import express from 'express'
import User from '../models/User.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// Get all users except logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router