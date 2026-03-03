import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Edit, Download, AlertTriangle, Shield, Eye, Lock, TrendingUp, Flag, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { mockFraudAlerts } from '../mock-data/index.js'

const RiskFraudMonitoring = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRisk, setFilterRisk] = useState('all')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [showFreezeModal, setShowFreezeModal] = useState(false)
  const [showEscalateModal, setShowEscalateModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true)
      setTimeout(() => {
        setAlerts(mockFraudAlerts)
        setLoading(false)
      }, 1000)
    }
    fetchAlerts()
  }, [])

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.alertType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus
    const matchesRisk = filterRisk === 'all' || 
      (filterRisk === 'high' && alert.riskScore >= 80) ||
      (filterRisk === 'medium' && alert.riskScore >= 60 && alert.riskScore < 80) ||
      (filterRisk === 'low' && alert.riskScore < 60)
    return matchesSearch && matchesStatus && matchesRisk
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedAlerts = filteredAlerts.slice(startIndex, endIndex)

  const handleFreezeAccount = () => {
    if (selectedAlert) {
      setAlerts(alerts.map(alert => 
        alert.id === selectedAlert.id 
          ? { ...alert, status: 'ACCOUNT_FROZEN' }
          : alert
      ))
      setShowFreezeModal(false)
      setSelectedAlert(null)
    }
  }

  const handleEscalateCase = () => {
    if (selectedAlert) {
      setAlerts(alerts.map(alert => 
        alert.id === selectedAlert.id 
          ? { ...alert, status: 'ESCALATED' }
          : alert
      ))
      setShowEscalateModal(false)
      setSelectedAlert(null)
    }
  }

  const getRiskBadgeVariant = (score) => {
    if (score >= 90) return 'danger'
    if (score >= 75) return 'warning'
    return 'info'
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'PENDING_REVIEW': return 'warning'
      case 'ESCALATED': return 'info'
      case 'ACCOUNT_FROZEN': return 'danger'
      case 'RESOLVED': return 'success'
      default: return 'default'
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
        <h2 className="text-2xl font-bold text-black">Risk & Fraud Monitoring</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const csvContent = [
                ['Alert ID', 'Transaction ID', 'User', 'Amount', 'Risk Score', 'Alert Type', 'Status', 'Timestamp', 'Location'],
                ...filteredAlerts.map(alert => [
                  alert.id,
                  alert.transactionId,
                  alert.userName,
                  alert.amount,
                  alert.riskScore,
                  alert.alertType,
                  alert.status,
                  alert.timestamp,
                  alert.location
                ])
              ].map(row => row.join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'fraud-alerts.csv'
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
              <p className="text-sm font-medium text-white">Total Alerts</p>
              <p className="text-2xl font-bold text-white">{alerts.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-white/70" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">High Risk</p>
              <p className="text-2xl font-bold text-white">{alerts.filter(a => a.riskScore >= 80).length}</p>
            </div>
            <Shield className="w-8 h-8 text-red-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Pending Review</p>
              <p className="text-2xl font-bold text-white">{alerts.filter(a => a.status === 'PENDING_REVIEW').length}</p>
            </div>
            <Eye className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Accounts Frozen</p>
              <p className="text-2xl font-bold text-white">{alerts.filter(a => a.status === 'ACCOUNT_FROZEN').length}</p>
            </div>
            <Lock className="w-8 h-8 text-blue-400" />
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
                placeholder="Search alerts..."
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
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="ESCALATED">Escalated</option>
            <option value="ACCOUNT_FROZEN">Account Frozen</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk (80+)</option>
            <option value="medium">Medium Risk (60-79)</option>
            <option value="low">Low Risk (&lt;60)</option>
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
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
            >
              <option value="all">All Alert Types</option>
              <option value="UNUSUAL_AMOUNT">Unusual Amount</option>
              <option value="MULTIPLE_TRANSACTIONS">Multiple Transactions</option>
              <option value="NEW_DEVICE">New Device</option>
              <option value="FOREIGN_TRANSACTION">Foreign Transaction</option>
              <option value="VELOCITY_CHECK">Velocity Check</option>
              <option value="SUSPICIOUS_PATTERN">Suspicious Pattern</option>
            </select>
            <select
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
            >
              <option value="all">All Locations</option>
              <option value="Addis Ababa">Addis Ababa</option>
              <option value="Bahir Dar">Bahir Dar</option>
              <option value="Hawassa">Hawassa</option>
              <option value="Mekelle">Mekelle</option>
              <option value="Gondar">Gondar</option>
              <option value="Dubai">Dubai</option>
            </select>
          </div>
        )}
      </Card>

      {/* Fraud Alerts Table */}
      <Card>
        <Table
          columns={[
            {
              key: 'transactionId',
              label: 'Transaction',
              render: (value, row) => (
                <div>
                  <div className="text-sm font-medium text-white">{value}</div>
                  <div className="text-sm text-white/70">{row.userName}</div>
                </div>
              )
            },
            {
              key: 'amount',
              label: 'Amount',
              render: (value) => (
                <span className="text-sm font-semibold text-white">
                  ETB {value.toLocaleString()}
                </span>
              )
            },
            {
              key: 'riskScore',
              label: 'Risk Score',
              render: (value) => (
                <Badge variant={getRiskBadgeVariant(value)}>
                  {value}
                </Badge>
              )
            },
            {
              key: 'alertType',
              label: 'Alert Type',
              render: (value) => (
                <span className="text-sm text-white">{value.replace('_', ' ')}</span>
              )
            },
            {
              key: 'status',
              label: 'Status',
              render: (value) => (
                <Badge variant={getStatusBadgeVariant(value)}>
                  {value.replace('_', ' ')}
                </Badge>
              )
            },
            {
              key: 'timestamp',
              label: 'Time',
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
                      setSelectedAlert(row)
                      setShowFreezeModal(true)
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    disabled={row.status === 'ACCOUNT_FROZEN'}
                  >
                    <Lock className="w-3 h-3 mr-1" />
                    {row.status === 'ACCOUNT_FROZEN' ? 'Frozen' : 'Freeze'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAlert(row)
                      setShowEscalateModal(true)
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                    disabled={row.status === 'ESCALATED'}
                  >
                    <Flag className="w-3 h-3 mr-1" />
                    {row.status === 'ESCALATED' ? 'Escalated' : 'Escalate'}
                  </button>
                </div>
              )
            }
          ]}
          data={paginatedAlerts}
        />
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm text-white">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAlerts.length)} of {filteredAlerts.length} alerts
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

      {/* Freeze Account Modal */}
      <Modal
        isOpen={showFreezeModal}
        onClose={() => setShowFreezeModal(false)}
        title="Freeze Account"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-white">
            Are you sure you want to freeze the account associated with this fraud alert?
          </p>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-white/70">
              <strong>Transaction:</strong> {selectedAlert?.transactionId}<br />
              <strong>User:</strong> {selectedAlert?.userName}<br />
              <strong>Amount:</strong> ETB {selectedAlert?.amount?.toLocaleString()}
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowFreezeModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleFreezeAccount}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Freeze Account
            </button>
          </div>
        </div>
      </Modal>

      {/* Escalate Case Modal */}
      <Modal
        isOpen={showEscalateModal}
        onClose={() => setShowEscalateModal(false)}
        title="Escalate Case"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-white">
            Escalate this fraud alert to the compliance team for further investigation?
          </p>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-white/70">
              <strong>Transaction:</strong> {selectedAlert?.transactionId}<br />
              <strong>User:</strong> {selectedAlert?.userName}<br />
              <strong>Risk Score:</strong> {selectedAlert?.riskScore}
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowEscalateModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEscalateCase}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Escalate Case
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default RiskFraudMonitoring
