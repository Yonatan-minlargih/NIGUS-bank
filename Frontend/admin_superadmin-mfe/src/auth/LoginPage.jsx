import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './authContext'
import { Eye, EyeOff, Mail, Lock, Building } from 'lucide-react'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email, password)
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else if (user.role === 'SUPER_ADMIN') {
        navigate('/superadmin/dashboard')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="w-1/2 bg-green-700 flex flex-col justify-center px-12">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Building className="w-8 h-8 text-white mr-3" />
            <h1 className="text-3xl font-bold text-white">NIGUS Bank</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Experience Premium <span className="text-yellow-400">Digital Banking</span>
          </h2>
          <p className="text-green-100 mb-8">
            Manage your banking operations with our secure and intuitive admin platform.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center text-green-100">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <span>Instant Account Opening</span>
            </div>
            <div className="flex items-center text-green-100">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <span>Secure Transfers</span>
            </div>
            <div className="flex items-center text-green-100">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <span>24/7 Premium Support</span>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <p className="text-green-200 text-sm italic">
            "NIGUS Bank has transformed how we manage our banking operations."
          </p>
          <p className="text-green-300 text-xs mt-2">- Banking Partner</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-md px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h3>
            <p className="text-gray-600">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
            <div className="text-xs space-y-1">
              <p><strong>Admin:</strong> admin@nigusbank.com / Admin@123</p>
              <p><strong>Super Admin:</strong> superadmin@nigusbank.com / SuperAdmin@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
