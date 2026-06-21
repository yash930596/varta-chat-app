import express from 'express'
import Group from '../models/Group.js'
import Message from '../models/Message.js'
import protect from '../middleware/authMiddleware.js'
import cloudinary from '../config/cloudinary.js'

const router = express.Router()

// Create group
router.post('/', protect, async (req, res) => {
  try {
    const { name, members } = req.body

    const group = await Group.create({
      name,
      members: [...members, req.user._id],
      admin: req.user._id
    })

    res.status(201).json(group)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get all groups for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id }).populate('members', 'name email')
    res.json(groups)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get group messages
router.get('/:groupId/messages', protect, async (req, res) => {
  try {
    const messages = await Message.find({ groupId: req.params.groupId }).sort({ createdAt: 1 })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Send group message
router.post('/:groupId/messages', protect, async (req, res) => {
  try {
    const { text, image } = req.body

    let imageUrl = ''
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image)
      imageUrl = uploadRes.secure_url
    }

    const newMessage = await Message.create({
      senderId: req.user._id,
      groupId: req.params.groupId,
      text,
      image: imageUrl
    })
    res.status(201).json(newMessage)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router