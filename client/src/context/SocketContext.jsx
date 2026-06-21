import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const { user } = useAuth()
  const [onlineUsers, setOnlineUsers] = useState([])
  const socketRef = useRef(null)

  useEffect(() => {
    if (!user) return

    socketRef.current = io('http://localhost:5000')
    socketRef.current.emit('addUser', user.id)

    socketRef.current.on('getOnlineUsers', (users) => {
      setOnlineUsers(users)
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [user])

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)