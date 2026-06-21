import { createContext, useState, useContext } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('varta_user')) || null)
  const [token, setToken] = useState(localStorage.getItem('varta_token') || null)

  const API_URL = 'http://localhost:5000/api/auth'

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/register`, { name, email, password })
    setUser(res.data.user)
    setToken(res.data.token)
    localStorage.setItem('varta_user', JSON.stringify(res.data.user))
    localStorage.setItem('varta_token', res.data.token)
    return res.data
  }

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password })
    setUser(res.data.user)
    setToken(res.data.token)
    localStorage.setItem('varta_user', JSON.stringify(res.data.user))
    localStorage.setItem('varta_token', res.data.token)
    return res.data
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('varta_user')
    localStorage.removeItem('varta_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)