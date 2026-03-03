import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye, Download } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { mockUsers } from '../mock-data/index.js'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [filterRole, setFilterRole] = useState('all')
  const [filterPremium, setFilterPremium] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setTimeout(() => {
        setUsers(mockUsers)
        setLoading(false)
      }, 1000)
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.userId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || user.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole.toLowerCase()
    const matchesPremium = filterPremium === 'all' || 
      (filterPremium === 'premium' && user.isPremium) || 
      (filterPremium === 'regular' && !user.isPremium)
    
    return matchesSearch && matchesStatus && matchesRole && matchesPremium
  })

  const handleUserAction = (action, user) => {
    switch (action) {
      case 'view':
        setSelectedUser(user)
        setShowUserModal(true)
        break
      case 'enable':
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, status: 'ACTIVE' } : u
        ))
        break
      case 'disable':
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, status: 'DISABLED' } : u
        ))
        break
      case 'premium':
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, isPremium: !u.isPremium } : u
        ))
        break
      case 'delete':
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
          setUsers(users.filter(u => u.id !== user.id))
        }
        break
      case 'reset2fa':
        alert(`2FA reset initiated for ${user.name} (mock action)`)
        break
      case 'resetPassword':
        alert(`Password reset initiated for ${user.name} (mock action)`)
        break
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">User Management</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const csvContent = [
                ['User ID', 'Name', 'Email', 'Role', 'Status', 'Premium', 'Created Date', 'Last Login'],
                ...filteredUsers.map(user => [
                  user.userId,
                  user.name,
                  user.email,
                  user.role,
                  user.status,
                  user.isPremium ? 'Yes' : 'No',
                  user.createdAt,
                  user.lastLogin
                ])
              ].map(row => row.join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'user-history.csv'
              a.click()
              window.URL.revokeObjectURL(url)
            }}
            className="inline-flex items-center px-6 py-2.5 bg-[#2D8C5B] text-white rounded-xl shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-[#247349] transition-all duration-200"
            style={{ width: '200.61000061035156px', height: '44px', gap: '8px', borderRadius: '12px', paddingTop: '10px', paddingRight: '24px', paddingBottom: '10px', paddingLeft: '24px' }}
          >
            <Download className="w-5 h-5" />
            Export History
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <button 
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="inline-flex items-center justify-center px-4 py-2 bg-[#FFFFFF01] border border-white/20 rounded-lg shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 text-white transition-all duration-200"
          >
            <Filter className="w-5 h-5 mr-2" />
            {showMoreFilters ? 'Less Filters' : 'More Filters'}
          </button>
        </div>
        
        {showMoreFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
            <select
              value={filterPremium}
              onChange={(e) => setFilterPremium(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
            >
              <option value="all">All Users</option>
              <option value="premium">Premium</option>
              <option value="regular">Regular</option>
            </select>
          </div>
        )}
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={[
            {
              key: 'name',
              label: 'User',
              render: (value, row) => (
                <div>
                  <div className="text-sm font-medium text-white">{value}</div>
                  <div className="text-sm text-white">{row.email}</div>
                </div>
              )
            },
            {
              key: 'isPremium',
              label: 'Role',
              render: (value) => (
                <Badge variant={value ? 'success' : 'default'}>
                  {value ? 'Premium' : 'User'}
                </Badge>
              )
            },
            {
              key: 'status',
              label: 'Status',
              render: (value) => (
                <Badge 
                  variant={
                    value === 'ACTIVE' ? 'success' :
                    value === 'DISABLED' ? 'warning' : 'error'
                  }
                >
                  {value}
                </Badge>
              )
            },
            {
              key: 'createdAt',
              label: 'Join Date',
              render: (value) => new Date(value).toLocaleDateString()
            },
            {
              key: 'lastLogin',
              label: 'Last Login',
              render: (value) => value ? new Date(value).toLocaleDateString() : 'Never'
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (_, row) => (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleUserAction('view', row)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </button>
                  {row.status === 'DISABLED' ? (
                    <button 
                      onClick={() => handleUserAction('enable', row)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Enable
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleUserAction('disable', row)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Disable
                    </button>
                  )}
                  <button 
                    onClick={() => handleUserAction('premium', row)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    {row.isPremium ? 'Remove Premium' : 'Make Premium'}
                  </button>
                  <button 
                    onClick={() => handleUserAction('reset2fa', row)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Reset 2FA
                  </button>
                  <button 
                    onClick={() => handleUserAction('resetPassword', row)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Reset Password
                  </button>
                  <button 
                    onClick={() => handleUserAction('delete', row)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </button>
                </div>
              )
            }
          ]}
          data={filteredUsers}
          loading={loading}
        />
      </Card>

      {/* User Details Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white">Name</label>
                <p className="mt-1 text-sm text-white">{selectedUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Email</label>
                <p className="mt-1 text-sm text-white">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Status</label>
                <Badge 
                  variant={
                    selectedUser.status === 'ACTIVE' ? 'success' :
                    selectedUser.status === 'DISABLED' ? 'warning' : 'error'
                  }
                >
                  {selectedUser.status}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Premium</label>
                <Badge variant={selectedUser.isPremium ? 'success' : 'default'}>
                  {selectedUser.isPremium ? 'Premium' : 'Regular'}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Join Date</label>
                <p className="mt-1 text-sm text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Last Login</label>
                <p className="mt-1 text-sm text-white">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default UserManagement
