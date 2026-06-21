import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const CreateGroupModal = ({ users, onClose, onGroupCreated }) => {
  const [name, setName] = useState('')
  const [selectedMembers, setSelectedMembers] = useState([])
  const { token } = useAuth()

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const handleCreate = async () => {
    if (!name.trim() || selectedMembers.length === 0) return

    const res = await axios.post(
      'http://localhost:5000/api/groups',
      { name, members: selectedMembers },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    onGroupCreated(res.data)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-white text-lg font-semibold mb-4">Create Group</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group name"
          className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00D4FF] transition mb-4 placeholder-gray-600"
        />

        <p className="text-gray-400 text-xs mb-2">Select members</p>
        <div className="max-h-48 overflow-y-auto space-y-2 mb-5">
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => toggleMember(u._id)}
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition ${
                selectedMembers.includes(u._id) ? 'bg-[#00D4FF]/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#00D4FF]/20 flex items-center justify-center text-[#00D4FF] text-xs font-bold">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <p className="text-white text-sm">{u.name}</p>
              {selectedMembers.includes(u._id) && (
                <span className="ml-auto text-[#00D4FF] text-xs">✓</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 text-gray-400 py-2.5 rounded-xl text-sm hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 bg-[#00D4FF] text-black font-semibold py-2.5 rounded-xl text-sm hover:bg-[#00b8d9] transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateGroupModal