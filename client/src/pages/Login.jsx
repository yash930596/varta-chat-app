import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      navigate('/chat')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-6">

      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[150px] rounded-full"></div>

      <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Section */}
        <div className="hidden lg:block">

          <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-5xl mb-8 shadow-xl">
            💬
          </div>

          <h1 className="text-7xl font-bold text-white mb-6">
            Varta
          </h1>

          <p className="text-2xl text-slate-300 leading-relaxed mb-10">
            Connect with friends, teams and communities through
            secure real-time conversations.
          </p>

          <div className="space-y-5">

            <div className="flex items-center gap-4 text-lg text-slate-300">
              <span className="text-green-400 text-xl">✓</span>
              Instant Real-Time Messaging
            </div>

            <div className="flex items-center gap-4 text-lg text-slate-300">
              <span className="text-green-400 text-xl">✓</span>
              Secure & Private Chats
            </div>

            <div className="flex items-center gap-4 text-lg text-slate-300">
              <span className="text-green-400 text-xl">✓</span>
              Online Presence Tracking
            </div>

            <div className="flex items-center gap-4 text-lg text-slate-300">
              <span className="text-green-400 text-xl">✓</span>
              Share Images & Files
            </div>

          </div>

        </div>

        {/* Login Card */}
        <div className="w-full max-w-xl mx-auto">

          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-10 md:p-12 shadow-2xl">

            <div className="text-center mb-10">

              <h2 className="text-5xl font-bold text-white mb-3">
                Welcome Back
              </h2>

              <p className="text-slate-400 text-lg">
                Sign in to continue your conversations
              </p>

            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">

              <div>
                <label className="block text-slate-300 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold text-lg hover:scale-[1.02] transition-all duration-300 shadow-xl"
              >
                Sign In
              </button>

            </form>

            <div className="mt-8 text-center">

              <p className="text-slate-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Create Account
                </Link>
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Login