import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import ChatBox from '../components/ChatBox'
import GroupChatBox from '../components/GroupChatBox'
import CreateGroupModal from '../components/CreateGroupModal'

const Avatar = ({ name, size = 40, online }) => (
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

const Chat = () => {
  const [users, setUsers] = useState([])
  const [groups, setGroups] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const { user, token, logout } = useAuth()
  const { onlineUsers } = useSocket()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const usersRes = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(usersRes.data)

      const groupsRes = await axios.get('http://localhost:5000/api/groups', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setGroups(groupsRes.data)
    }
    fetchData()
  }, [token])

  const handleSelectUser = (u) => {
    setSelectedUser(u)
    setSelectedGroup(null)
  }

  const handleSelectGroup = (g) => {
    setSelectedGroup(g)
    setSelectedUser(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[85vh] flex bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

        {/* Sidebar */}
        <div className="w-[30%] min-w-[280px] h-full border-r border-white/10 flex flex-col">

          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#00D4FF]">Varta</h1>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-xs transition">
              Logout
            </button>
          </div>

          <div className="p-4 flex items-center gap-3 border-b border-white/10">
            <Avatar name={user?.name} size={40} />
            <div>
              <p className="text-white text-sm font-medium">{user?.name}</p>
              <p className="text-gray-500 text-xs">{user?.email}</p>
            </div>
          </div>

          {/* Create group button */}
          <div className="p-3 border-b border-white/10">
            <button
              onClick={() => setShowGroupModal(true)}
              className="w-full bg-[#00D4FF]/10 text-[#00D4FF] text-sm py-2 rounded-xl hover:bg-[#00D4FF]/20 transition flex items-center justify-center gap-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 19v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              New Group
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Groups */}
            {groups.length > 0 && (
              <div>
                <p className="text-gray-500 text-xs px-4 pt-3 pb-1">Groups</p>
                {groups.map((g) => (
                  <div
                    key={g._id}
                    onClick={() => handleSelectGroup(g)}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition border-l-2 ${
                      selectedGroup?._id === g._id
                        ? 'bg-[#00D4FF]/10 border-[#00D4FF]'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7F77DD] to-[#3C3489] flex items-center justify-center text-[#EEEDFE] font-semibold">
                      {g.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{g.name}</p>
                      <p className="text-gray-500 text-xs">{g.members.length} members</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Direct messages */}
            <p className="text-gray-500 text-xs px-4 pt-3 pb-1">Direct Messages</p>
            {users.map((u) => {
              const isOnline = onlineUsers.includes(u._id)
              return (
                <div
                  key={u._id}
                  onClick={() => handleSelectUser(u)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition border-l-2 ${
                    selectedUser?._id === u._id
                      ? 'bg-[#00D4FF]/10 border-[#00D4FF]'
                      : 'border-transparent'
                  }`}
                >
                  <Avatar name={u.name} size={40} online={isOnline} />
                  <div>
                    <p className="text-white text-sm font-medium">{u.name}</p>
                    <p className={`text-xs ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 h-full">
          {selectedUser && <ChatBox selectedUser={selectedUser} />}
          {selectedGroup && <GroupChatBox selectedGroup={selectedGroup} />}
          {!selectedUser && !selectedGroup && (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p className="text-lg">Select a contact or group to start chatting</p>
            </div>
          )}
        </div>
      </div>

      {showGroupModal && (
        <CreateGroupModal
          users={users}
          onClose={() => setShowGroupModal(false)}
          onGroupCreated={(group) => setGroups((prev) => [...prev, group])}
        />
      )}
    </div>
  )
}

export default Chat