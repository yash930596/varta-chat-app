import express from 'express'
import Message from '../models/Message.js'
import protect from '../middleware/authMiddleware.js'
import cloudinary from '../config/cloudinary.js'

const router = express.Router()

// Get messages between logged-in user and another user
router.get('/:userId', protect, async (req, res) => {
  try {
    const myId = req.user._id
    const { userId } = req.params

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 })

    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Send a message
// Send a message
router.post('/:userId', protect, async (req, res) => {
  try {
    const senderId = req.user._id
    const { userId: receiverId } = req.params
    const { text, image } = req.body

    let imageUrl = ''
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image)
      imageUrl = uploadRes.secure_url
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    })

    res.status(201).json(newMessage)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router