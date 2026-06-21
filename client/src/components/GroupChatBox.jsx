import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'

const GroupChatBox = ({ selectedGroup }) => {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const { user, token } = useAuth()
  const { socket } = useSocket()
  const scrollRef = useRef()

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(`http://localhost:5000/api/groups/${selectedGroup._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessages(res.data)
    }
    fetchMessages()

    socket?.emit('joinGroup', selectedGroup._id)
  }, [selectedGroup, token, socket])

  useEffect(() => {
    if (!socket) return

    socket.on('getGroupMessage', (data) => {
      setMessages((prev) => [...prev, data])
    })

    return () => socket.off('getGroupMessage')
  }, [socket])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    const newMessage = {
      groupId: selectedGroup._id,
      senderId: user.id,
      text
    }

    socket.emit('sendGroupMessage', newMessage)

    await axios.post(`http://localhost:5000/api/groups/${selectedGroup._id}/messages`, { text }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    setMessages((prev) => [...prev, { ...newMessage, createdAt: new Date() }])
    setText('')
  }

  const getSenderName = (senderId) => {
    const member = selectedGroup.members.find((m) => m._id === senderId)
    return member ? member.name : 'Unknown'
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#00D4FF]/20 flex items-center justify-center text-[#00D4FF] font-bold text-sm">
          {selectedGroup.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-medium text-sm">{selectedGroup.name}</p>
          <p className="text-gray-500 text-xs">{selectedGroup.members.length} members</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            ref={i === messages.length - 1 ? scrollRef : null}
            className={`flex flex-col ${msg.senderId === user.id ? 'items-end' : 'items-start'}`}
          >
            {msg.senderId !== user.id && (
              <p className="text-gray-500 text-[10px] mb-1 px-1">{getSenderName(msg.senderId)}</p>
            )}
            <div
              className={`max-w-[60%] px-4 py-2 rounded-2xl text-sm ${
                msg.senderId === user.id
                  ? 'bg-[#00D4FF] text-black rounded-br-sm'
                  : 'bg-white/10 text-white rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-white/10 flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00D4FF] transition placeholder-gray-600"
        />
        <button
          type="submit"
          className="bg-[#00D4FF] hover:bg-[#00b8d9] text-black font-semibold px-5 rounded-xl transition text-sm"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default GroupChatBox