import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiService } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('admin_user')
      const token = localStorage.getItem('admin_token')
      
      if (storedUser && token) {
        try {
          const profile = await apiService.getCurrentProfile()
          if (profile.success && profile.data) {
            setUser(profile.data)
            localStorage.setItem('admin_user', JSON.stringify(profile.data))
          }
        } catch (error) {
          console.error('Failed to refresh profile:', error)
          localStorage.removeItem('admin_user')
          localStorage.removeItem('admin_token')
        }
      }
      setLoading(false)
    }
    
    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password)
      
      if (response.success && response.data) {
        const { token, admin } = response.data
        
        localStorage.setItem('admin_token', token)
        localStorage.setItem('admin_user', JSON.stringify(admin))
        
        setUser(admin)
        return admin
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('admin_user')
      localStorage.removeItem('admin_token')
    }
  }

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'SUPER_ADMIN') return true
    return user.permissions?.includes(permission) || false
  }

  const isAdmin = () => user?.role === 'ADMIN'
  const isSuperAdmin = () => user?.role === 'SUPER_ADMIN'

  const value = {
    user,
    login,
    logout,
    hasPermission,
    isAdmin,
    isSuperAdmin,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
