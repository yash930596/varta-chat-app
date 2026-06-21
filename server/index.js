import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import messageRoutes from './routes/message.js'
import groupRoutes from './routes/group.js'

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/groups', groupRoutes)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log(err))

// Track online users: { userId: socketId }
const onlineUsers = new Map()

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id)

  // User comes online
 socket.on('addUser', (userId) => {
  console.log('✅ addUser called with:', userId)
  onlineUsers.set(userId, socket.id)
  console.log('Current onlineUsers map:', Array.from(onlineUsers.entries()))
  io.emit('getOnlineUsers', Array.from(onlineUsers.keys()))
})

  // Send message
 socket.on('sendMessage', ({ senderId, receiverId, text, image }) => {
  console.log('📤 sendMessage from', senderId, 'to', receiverId)
  console.log('Looking up receiver in onlineUsers:', onlineUsers.get(receiverId))
  const receiverSocketId = onlineUsers.get(receiverId)
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('getMessage', {
      senderId,
      text,
      image,
      createdAt: new Date()
    })
  } else {
    console.log('❌ Receiver not found in onlineUsers!')
  }
})

  // Join a group room
  socket.on('joinGroup', (groupId) => {
    socket.join(groupId)
  })

  // Send group message
  socket.on('sendGroupMessage', ({ groupId, senderId, text, image }) => {
    socket.to(groupId).emit('getGroupMessage', {
      senderId,
      text,
      image,
      createdAt: new Date()
    })
  })

  // User disconnects
  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id)
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId)
        break
      }
    }
    io.emit('getOnlineUsers', Array.from(onlineUsers.keys()))
  })
})

server.listen(5000, () => console.log('🚀 Server running on port 5000'))