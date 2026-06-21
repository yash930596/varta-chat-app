import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'

const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const Avatar = ({ name, size = 36, online }) => (
  <div className="relative shrink-0">
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-br from-[#00D4FF] to-[#0066AA] flex items-center justify-center font-semibold text-[#04222b]"
    >
      {name?.charAt(0).toUpperCase()}
    </div>
    {online && (
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-black" />
    )}
  </div>
)

const ChatBox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const { user, token } = useAuth()
  const { socket, onlineUsers } = useSocket()
  const scrollRef = useRef()
  const fileInputRef = useRef()

  const isOnline = onlineUsers.includes(selectedUser._id)

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(`https://varta-backend-spju.onrender.com/api/messages/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessages(res.data)
    }
    fetchMessages()
  }, [selectedUser, token])

  useEffect(() => {
    if (!socket) return

    socket.on('getMessage', (data) => {
      if (data.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, data])
      }
    })

    return () => socket.off('getMessage')
  }, [socket, selectedUser])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() && !imagePreview) return

    try {
      const res = await axios.post(
        `https://varta-backend-spju.onrender.com/api/messages/${selectedUser._id}`,
        { text, image: imagePreview },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const savedMessage = res.data

      const newMessage = {
        senderId: user.id,
        receiverId: selectedUser._id,
        text: savedMessage.text,
        image: savedMessage.image,
        createdAt: savedMessage.createdAt
      }

      socket.emit('sendMessage', newMessage)

      setMessages((prev) => [...prev, newMessage])
      setText('')
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.log('Failed to send message:', error)
    }
  }

  return (
    <div className="flex flex-col h-full w-full">

      {/* Header */}
      <div className="px-5 py-3.5 border-b border-white/10 flex items-center gap-3 shadow-[0_1px_0_rgba(0,0,0,0.3)]">
        <Avatar name={selectedUser.name} size={34} online={isOnline} />
        <div>
          <p className="text-white font-medium text-sm">{selectedUser.name}</p>
          <p className={`text-xs ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === user.id
          return (
            <div
              key={i}
              ref={i === messages.length - 1 ? scrollRef : null}
              className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}
            >
              {msg.image ? (
                <div
                  className={`p-1 rounded-2xl ${
                    isMe ? 'bg-[#00D4FF] rounded-br-md' : 'bg-white/10 rounded-bl-md'
                  }`}
                >
                  <img
                    src={msg.image}
                    alt="shared"
                    className="rounded-xl max-w-[200px] max-h-[220px] object-cover"
                  />
                  {msg.text && (
                    <p className={`text-sm px-2 pt-1 pb-1 ${isMe ? 'text-black' : 'text-white'}`}>
                      {msg.text}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className={`max-w-[60%] px-4 py-2 text-sm ${
                    isMe
                      ? 'bg-[#00D4FF] text-black rounded-2xl rounded-br-md'
                      : 'bg-white/10 text-white rounded-2xl rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
              )}
              <span className="text-[10px] text-gray-500 px-1">{formatTime(msg.createdAt)}</span>
            </div>
          )
        })}
      </div>

      {/* Image preview before sending */}
      {imagePreview && (
        <div className="px-4 pb-2 flex items-center gap-2">
          <img src={imagePreview} alt="preview" className="w-16 h-16 rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => {
              setImagePreview(null)
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
            className="text-red-400 text-xs hover:underline"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3.5 border-t border-white/10 flex gap-3 items-center">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="text-gray-400 hover:text-[#00D4FF] transition shrink-0"
          aria-label="Attach image"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 text-white rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#00D4FF] transition placeholder-gray-600"
        />
        <button
          type="submit"
          className="w-9 h-9 shrink-0 bg-[#00D4FF] hover:bg-[#00b8d9] rounded-full flex items-center justify-center transition"
          aria-label="Send message"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#04222b" stroke="none">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default ChatBox