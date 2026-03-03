import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye, Download, Shield, Lock, Unlock, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { apiService } from '../../../services/api'
import { mockSuperAdmins } from '../mock-data/index.js'

const AdminManagement = () => {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [error, setError] = useState(null)

  // Form state for create modal
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'ADMIN',
    department: 'Operations',
    permissions: ['USER_MANAGEMENT']
  })

  const fetchAdmins = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getAdmins(
        currentPage - 1,
        itemsPerPage,
        searchTerm,
        filterRole !== 'all' ? filterRole : '',
        filterStatus !== 'all' ? filterStatus : ''
      )
      if (response.success && response.data) {
        setAdmins(response.data.content || [])
        setTotalElements(response.data.totalElements || 0)
      }
    } catch (err) {
      console.error('Failed to fetch admins:', err)
      setError('Failed to load admins. Using mock data.')
      setAdmins(mockSuperAdmins)
      setTotalElements(mockSuperAdmins.length)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [currentPage, searchTerm, filterRole, filterStatus])

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || admin.role === filterRole
    const matchesStatus = filterStatus === 'all' || admin.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedAdmins = filteredAdmins.slice(startIndex, endIndex)

  const handleCreateAdmin = async () => {
    try {
      const response = await apiService.createAdmin(formData)
      if (response.success) {
        setShowCreateModal(false)
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          role: 'ADMIN',
          department: 'Operations',
          permissions: ['USER_MANAGEMENT']
        })
        fetchAdmins()
      }
    } catch (err) {
      console.error('Failed to create admin:', err)
      alert('Failed to create admin: ' + err.message)
    }
  }

  const handleEditAdmin = async (updatedAdmin) => {
    try {
      const response = await apiService.updateAdmin(selectedAdmin.id, updatedAdmin)
      if (response.success) {
        setShowEditModal(false)
        setSelectedAdmin(null)
        fetchAdmins()
      }
    } catch (err) {
      console.error('Failed to update admin:', err)
      alert('Failed to update admin: ' + err.message)
    }
  }

  const handleSuspendAdmin = async () => {
    if (!selectedAdmin) return
    
    try {
      if (selectedAdmin.status === 'ACTIVE') {
        await apiService.suspendAdmin(selectedAdmin.id, 'Suspended by super admin')
      } else {
        await apiService.activateAdmin(selectedAdmin.id)
      }
      setShowSuspendModal(false)
      setSelectedAdmin(null)
      fetchAdmins()
    } catch (err) {
      console.error('Failed to update admin status:', err)
      alert('Failed to update admin status: ' + err.message)
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
        <h2 className="text-2xl font-bold text-black">Admin Management</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const csvContent = [
                ['ID', 'Name', 'Email', 'Role', 'Status', 'Department', 'Created Date', 'Last Login'],
                ...filteredAdmins.map(admin => [
                  admin.id,
                  admin.name,
                  admin.email,
                  admin.role,
                  admin.status,
                  admin.department,
                  admin.createdAt,
                  admin.lastLogin
                ])
              ].map(row => row.join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'admin-management.csv'
              a.click()
              window.URL.revokeObjectURL(url)
            }}
            className="inline-flex items-center px-6 py-2.5 bg-[#2D8C5B] text-white rounded-xl shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-[#247349] transition-all duration-200"
            style={{ width: '200.61000061035156px', height: '44px', gap: '8px', borderRadius: '12px', paddingTop: '10px', paddingRight: '24px', paddingBottom: '10px', paddingLeft: '24px' }}
          >
            <Download className="w-5 h-5" />
            Export History
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-[#2D8C5B] border hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-[#247349] rounded-xl text-white transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Admin
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Total Admins</p>
              <p className="text-2xl font-bold text-white">{admins.length}</p>
            </div>
            <Shield className="w-8 h-8 text-white/70" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Active</p>
              <p className="text-2xl font-bold text-white">{admins.filter(a => a.status === 'ACTIVE').length}</p>
            </div>
            <Unlock className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Suspended</p>
              <p className="text-2xl font-bold text-white">{admins.filter(a => a.status === 'SUSPENDED').length}</p>
            </div>
            <Lock className="w-8 h-8 text-red-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Super Admins</p>
              <p className="text-2xl font-bold text-white">{admins.filter(a => a.role === 'SUPER_ADMIN').length}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-white/70" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
              <input
                type="text"
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
              />
            </div>
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
          >
            <option value="all">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
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
              <option value="all">All Departments</option>
              <option value="IT Security">IT Security</option>
              <option value="Operations">Operations</option>
              <option value="Compliance">Compliance</option>
              <option value="Risk Management">Risk Management</option>
              <option value="Technology">Technology</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
            >
              <option value="all">All Permissions</option>
              <option value="ALL">All Access</option>
              <option value="READ_ONLY">Read Only</option>
            </select>
          </div>
        )}
      </Card>

      {/* Admins Table */}
      <Card>
        <Table
          columns={[
            {
              key: 'name',
              label: 'Admin',
              render: (value, row) => (
                <div>
                  <div className="text-sm font-medium text-white">{value}</div>
                  <div className="text-sm text-white">{row.email}</div>
                </div>
              )
            },
            {
              key: 'role',
              label: 'Role',
              render: (value) => (
                <Badge variant={value === 'SUPER_ADMIN' ? 'premium' : 'default'}>
                  {value.replace('_', ' ')}
                </Badge>
              )
            },
            {
              key: 'status',
              label: 'Status',
              render: (value) => (
                <Badge variant={value === 'ACTIVE' ? 'success' : 'danger'}>
                  {value}
                </Badge>
              )
            },
            {
              key: 'department',
              label: 'Department',
              render: (value) => (
                <span className="text-sm text-white">{value}</span>
              )
            },
            {
              key: 'lastLogin',
              label: 'Last Login',
              render: (value) => (
                <span className="text-sm text-white">
                  {new Date(value).toLocaleDateString()}
                </span>
              )
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (_, row) => (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedAdmin(row)
                      setShowActivityModal(true)
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Activity
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAdmin(row)
                      setShowEditModal(true)
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAdmin(row)
                      setShowSuspendModal(true)
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    disabled={row.status === 'SUSPENDED'}
                  >
                    <Lock className="w-3 h-3 mr-1" />
                    {row.status === 'SUSPENDED' ? 'Suspended' : 'Suspend'}
                  </button>
                </div>
              )
            }
          ]}
          data={paginatedAdmins}
        />
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm text-white">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAdmins.length)} of {filteredAdmins.length} admins
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-1.5 text-xs bg-white/10 text-white rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex items-center justify-center w-8 h-8 text-xs rounded transition-colors ${
                      currentPage === page
                        ? 'bg-[#2D8C5B] text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-1.5 text-xs bg-white/10 text-white rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Create Admin Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Admin"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
              placeholder="Enter admin name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
              placeholder="Enter password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Role</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Department</label>
            <select 
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
            >
              <option value="IT Security">IT Security</option>
              <option value="Operations">Operations</option>
              <option value="Compliance">Compliance</option>
              <option value="Risk Management">Risk Management</option>
              <option value="Technology">Technology</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateAdmin}
              className="px-4 py-2 bg-[#2D8C5B] text-white rounded-lg hover:bg-[#247349] transition-colors"
            >
              Create Admin
            </button>
          </div>
        </div>
      </Modal>

      {/* Suspend Admin Modal */}
      <Modal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        title="Confirm Action"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-white">
            Are you sure you want to {selectedAdmin?.status === 'ACTIVE' ? 'suspend' : 'reactivate'} 
            {' '}{selectedAdmin?.name}?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowSuspendModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSuspendAdmin}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {selectedAdmin?.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Activity Modal */}
      <Modal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        title="Admin Activity"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">Config Update - Interest Rate</span>
                <span className="text-white/70">2 hours ago</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white">Account Freeze - USR005</span>
                <span className="text-white/70">5 hours ago</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white">Admin Creation - ADM001</span>
                <span className="text-white/70">1 day ago</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowActivityModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminManagement
