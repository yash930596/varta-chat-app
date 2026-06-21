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

const CLIENT_URL =
  process.env.CLIENT_URL ||
  'https://varta-chat-app-orpin.vercel.app'

// Express CORS
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
)

app.use(express.json({ limit: '10mb' }))

// Socket.IO CORS
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/groups', groupRoutes)

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log(err))

// Track online users
const onlineUsers = new Map()

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id)

  socket.on('addUser', (userId) => {
    onlineUsers.set(userId, socket.id)

    io.emit('getOnlineUsers', Array.from(onlineUsers.keys()))

    console.log('Online users:', Array.from(onlineUsers.keys()))
  })

  socket.on('sendMessage', ({ senderId, receiverId, text, image }) => {
    const receiverSocketId = onlineUsers.get(receiverId)

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('getMessage', {
        senderId,
        receiverId,
        text,
        image,
        createdAt: new Date()
      })
    }
  })

  socket.on('joinGroup', (groupId) => {
    socket.join(groupId)
  })

  socket.on('sendGroupMessage', ({ groupId, senderId, text, image }) => {
    socket.to(groupId).emit('getGroupMessage', {
      senderId,
      text,
      image,
      createdAt: new Date()
    })
  })

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId)
        break
      }
    }

    io.emit('getOnlineUsers', Array.from(onlineUsers.keys()))

    console.log('🔴 User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})