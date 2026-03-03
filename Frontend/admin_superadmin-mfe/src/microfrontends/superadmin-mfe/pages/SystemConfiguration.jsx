import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Edit, Download, Settings, Save, RefreshCw, Database, Shield, Bell, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { apiService } from '../../../services/api'
import { mockSystemConfig } from '../mock-data/index.js'

const SystemConfiguration = () => {
  const [config, setConfig] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedConfig, setSelectedConfig] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [error, setError] = useState(null)

  const fetchConfigs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getConfigs(filterCategory !== 'all' ? filterCategory : '')
      if (response.success && response.data) {
        const configData = response.data.map(item => ({
          id: item.id,
          key: item.configKey,
          value: item.configValue,
          description: item.description,
          category: item.category,
          updated_by: item.updatedBy,
          updated_at: item.updatedAt,
          dataType: item.dataType,
          minValue: item.minValue,
          maxValue: item.maxValue,
          isEditable: item.isEditable
        }))
        setConfig(configData)
      }
    } catch (err) {
      console.error('Failed to fetch configs:', err)
      setError('Failed to load configurations. Using mock data.')
      setConfig(mockSystemConfig)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfigs()
  }, [filterCategory])

  const filteredConfig = config.filter(item => {
    const matchesSearch = item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredConfig.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedConfig = filteredConfig.slice(startIndex, endIndex)

  const handleEditConfig = async (updatedConfig) => {
    try {
      const response = await apiService.updateConfig(updatedConfig.key, {
        value: updatedConfig.value,
        description: updatedConfig.description
      })
      if (response.success) {
        setShowEditModal(false)
        setSelectedConfig(null)
        fetchConfigs()
      }
    } catch (err) {
      console.error('Failed to update config:', err)
      alert('Failed to update configuration: ' + err.message)
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
        <h2 className="text-2xl font-bold text-black">System Configuration</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const csvContent = [
                ['ID', 'Key', 'Value', 'Category', 'Description', 'Updated By', 'Updated At'],
                ...filteredConfig.map(item => [
                  item.id,
                  item.key,
                  item.value,
                  item.category,
                  item.description,
                  item.updated_by,
                  item.updated_at
                ])
              ].map(row => row.join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'system-configuration.csv'
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Total Configs</p>
              <p className="text-2xl font-bold text-white">{config.length}</p>
            </div>
            <Settings className="w-8 h-8 text-white/70" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Interest Rates</p>
              <p className="text-2xl font-bold text-white">{config.filter(c => c.category === 'INTEREST').length}</p>
            </div>
            <Database className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Transaction Limits</p>
              <p className="text-2xl font-bold text-white">{config.filter(c => c.category === 'TRANSACTION_LIMITS').length}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Security Settings</p>
              <p className="text-2xl font-bold text-white">{config.filter(c => c.category === 'SECURITY').length}</p>
            </div>
            <Bell className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
              <input
                type="text"
                placeholder="Search configurations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
          >
            <option value="all">All Categories</option>
            <option value="INTEREST">Interest</option>
            <option value="TRANSACTION_LIMITS">Transaction Limits</option>
            <option value="CURRENCY">Currency</option>
            <option value="SECURITY">Security</option>
            <option value="ACCOUNT">Account</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-[#FFFFFF01] border border-white/20 rounded-lg shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 text-white transition-all duration-200">
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>
      </Card>

      {/* Configuration Table */}
      <Card>
        <Table
          columns={[
            {
              key: 'key',
              label: 'Configuration Key',
              render: (value, row) => (
                <div>
                  <div className="text-sm font-medium text-white">{value}</div>
                  <div className="text-sm text-white/70">{row.description}</div>
                </div>
              )
            },
            {
              key: 'value',
              label: 'Current Value',
              render: (value) => (
                <span className="text-sm font-mono text-white bg-white/10 px-2 py-1 rounded">
                  {value}
                </span>
              )
            },
            {
              key: 'category',
              label: 'Category',
              render: (value) => (
                <Badge variant="info">
                  {value.replace('_', ' ')}
                </Badge>
              )
            },
            {
              key: 'updated_by',
              label: 'Updated By',
              render: (value) => (
                <span className="text-sm text-white">{value}</span>
              )
            },
            {
              key: 'updated_at',
              label: 'Last Updated',
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
                      setSelectedConfig(row)
                      setShowEditModal(true)
                    }}
                    className="p-1 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )
            }
          ]}
          data={paginatedConfig}
        />
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm text-white">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredConfig.length)} of {filteredConfig.length} configurations
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

      {/* Edit Config Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Configuration"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Configuration Key</label>
            <input
              type="text"
              value={selectedConfig?.key || ''}
              disabled
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Description</label>
            <textarea
              value={selectedConfig?.description || ''}
              disabled
              rows={2}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Current Value</label>
            <input
              type="text"
              value={selectedConfig?.value || ''}
              onChange={(e) => setSelectedConfig({...selectedConfig, value: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
              placeholder="Enter new value"
            />
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-white/70">
              <strong>Warning:</strong> Changing system configuration values may affect the entire banking system. 
              Please ensure you understand the impact before making changes.
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleEditConfig(selectedConfig)}
              className="px-4 py-2 bg-[#2D8C5B] text-white rounded-lg hover:bg-[#247349] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SystemConfiguration
