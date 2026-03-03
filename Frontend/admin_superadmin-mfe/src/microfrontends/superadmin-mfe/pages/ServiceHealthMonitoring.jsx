import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Edit, Download, Activity, Server, Database, Wifi, Clock, TrendingUp, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { mockSystemHealth } from '../mock-data/index.js'

const ServiceHealthMonitoring = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedService, setSelectedService] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      setTimeout(() => {
        setServices(mockSystemHealth)
        setLoading(false)
      }, 1000)
    }
    fetchServices()
  }, [])

  const filteredServices = services.filter(service => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedServices = filteredServices.slice(startIndex, endIndex)

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'HEALTHY': return 'success'
      case 'WARNING': return 'warning'
      case 'ERROR': return 'danger'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'HEALTHY': return '✅'
      case 'WARNING': return '⚠️'
      case 'ERROR': return '❌'
      default: return '❓'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const healthyServices = services.filter(s => s.status === 'HEALTHY').length
  const warningServices = services.filter(s => s.status === 'WARNING').length
  const errorServices = services.filter(s => s.status === 'ERROR').length
  const averageUptime = services.length > 0 ? (services.reduce((sum, s) => sum + s.uptime, 0) / services.length).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Service Health Monitoring</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const csvContent = [
                ['Service Name', 'Status', 'Response Time', 'Uptime', 'Last Check', 'Dependencies'],
                ...filteredServices.map(service => [
                  service.serviceName,
                  service.status,
                  service.responseTime,
                  service.uptime,
                  service.lastCheck,
                  service.dependencies.join('; ')
                ])
              ].map(row => row.join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'service-health.csv'
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
              <p className="text-sm font-medium text-white">Total Services</p>
              <p className="text-2xl font-bold text-white">{services.length}</p>
            </div>
            <Server className="w-8 h-8 text-white/70" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Healthy</p>
              <p className="text-2xl font-bold text-white">{healthyServices}</p>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Warnings</p>
              <p className="text-2xl font-bold text-white">{warningServices}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Errors</p>
              <p className="text-2xl font-bold text-white">{errorServices}</p>
            </div>
            <Database className="w-8 h-8 text-red-400" />
          </div>
        </Card>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">System Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Average Uptime</span>
              <span className="text-lg font-bold text-white">{averageUptime}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Health Score</span>
              <Badge variant={healthyServices === services.length ? 'success' : warningServices > 0 ? 'warning' : 'danger'}>
                {healthyServices === services.length ? 'Excellent' : warningServices > 0 ? 'Good' : 'Poor'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Last Updated</span>
              <span className="text-sm text-white">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Avg Response Time</span>
              <span className="text-lg font-bold text-white">
                {services.length > 0 ? Math.round(services.reduce((sum, s) => sum + s.responseTime, 0) / services.length) : 0}ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Fastest Service</span>
              <span className="text-sm text-white">
                {services.length > 0 ? services.reduce((fastest, s) => s.responseTime < fastest.responseTime ? s : fastest).serviceName : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Slowest Service</span>
              <span className="text-sm text-white">
                {services.length > 0 ? services.reduce((slowest, s) => s.responseTime > slowest.responseTime ? s : slowest).serviceName : 'N/A'}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white text-sm">
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Restart All Services
            </button>
            <button className="w-full text-left px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white text-sm">
              <Database className="w-4 h-4 inline mr-2" />
              Clear Cache
            </button>
            <button className="w-full text-left px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white text-sm">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Run Health Check
            </button>
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
                placeholder="Search services..."
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
            <option value="HEALTHY">Healthy</option>
            <option value="WARNING">Warning</option>
            <option value="ERROR">Error</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-[#FFFFFF01] border border-white/20 rounded-lg shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 text-white transition-all duration-200">
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh Status
          </button>
        </div>
      </Card>

      {/* Services Table */}
      <Card>
        <Table
          columns={[
            {
              key: 'serviceName',
              label: 'Service Name',
              render: (value, row) => (
                <div>
                  <div className="flex items-center">
                    <span className="mr-2">{getStatusIcon(row.status)}</span>
                    <div>
                      <div className="text-sm font-medium text-white">{value}</div>
                      <div className="text-sm text-white/70">{row.description}</div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              key: 'status',
              label: 'Status',
              render: (value) => (
                <Badge variant={getStatusBadgeVariant(value)}>
                  {value}
                </Badge>
              )
            },
            {
              key: 'responseTime',
              label: 'Response Time',
              render: (value) => (
                <span className="text-sm text-white">{value}ms</span>
              )
            },
            {
              key: 'uptime',
              label: 'Uptime',
              render: (value) => (
                <span className="text-sm text-white">{value}%</span>
              )
            },
            {
              key: 'lastCheck',
              label: 'Last Check',
              render: (value) => (
                <span className="text-sm text-white">
                  {new Date(value).toLocaleString()}
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
                      setSelectedService(row)
                      setShowDetailsModal(true)
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Activity className="w-3 h-3 mr-1" />
                    Details
                  </button>
                </div>
              )
            }
          ]}
          data={paginatedServices}
        />
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm text-white">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredServices.length)} of {filteredServices.length} services
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

      {/* Service Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Service Details"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Service Name</label>
              <input
                type="text"
                value={selectedService?.serviceName || ''}
                disabled
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Status</label>
              <input
                type="text"
                value={selectedService?.status || ''}
                disabled
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Response Time</label>
              <input
                type="text"
                value={selectedService?.responseTime ? `${selectedService.responseTime}ms` : ''}
                disabled
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Uptime</label>
              <input
                type="text"
                value={selectedService?.uptime ? `${selectedService.uptime}%` : ''}
                disabled
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Description</label>
            <textarea
              value={selectedService?.description || ''}
              disabled
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Dependencies</label>
            <input
              type="text"
              value={selectedService?.dependencies ? selectedService.dependencies.join(', ') : ''}
              disabled
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white/50"
            />
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setShowDetailsModal(false)}
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

export default ServiceHealthMonitoring
