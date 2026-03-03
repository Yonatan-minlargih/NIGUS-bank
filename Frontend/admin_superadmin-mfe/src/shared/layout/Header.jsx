import React from 'react'
import { Search, Bell, User } from 'lucide-react'
import { useAuth } from '../../auth/authContext'
const Header = ({ title }) => {
  const { user, logout } = useAuth()
  return (
    <header className="bg-[#2D8C5BE5] border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center space-x-4 w-full md:w-auto justify-center md:justify-start">
          {/* Search */}
          <div className="relative w-full max-w-xs md:max-w-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#FFFFFF99]" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full md:w-200 bg-[#FFFFFF33] text-[#FFFFFF99] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          {/* Notifications */}
          <button className="relative sm:pl-96 text-gray-600 hover:text-gray-900 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {/* User */}
          <div className="px-2 sm:px-4 rounded-full">
            <div className="flex items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600 rounded-full flex items-center justify-center mr-2 md:mr-3">
                <span className="text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-xs md:text-sm">{user?.name}</p>
                <p className="text-green-200 text-xs">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
