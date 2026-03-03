import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Edit, Download, FileText, Calendar, TrendingUp, Shield, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { mockAuditLogs } from '../mock-data/index.js'

const ComplianceReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      setTimeout(() => {
        // Transform audit logs into compliance reports
        const complianceReports = [
          {
            id: 'CR001',
            name: 'Monthly Transaction Report',
            type: 'TRANSACTION',
            date: '2024-01-20',
            status: 'READY',
            size: '2.4 MB',
            generatedBy: 'System',
            description: 'Complete monthly transaction summary for compliance review',
            recordCount: 15420
          },
          {
            id: 'CR002', 
            name: 'Admin Activity Logs',
            type: 'ADMIN',
            date: '2024-01-15',
            status: 'READY',
            size: '1.8 MB',
            generatedBy: 'John Smith',
            description: 'Comprehensive admin action logs for audit trail',
            recordCount: 856
          },
          {
            id: 'CR003',
            name: 'Account Closure Report',
            type: 'ACCOUNT',
            date: '2024-01-10',
            status: 'PROCESSING',
            size: '0.9 MB',
            generatedBy: 'Sarah Johnson',
            description: 'All account closures with reasons and compliance checks',
            recordCount: 124
          },
          {
            id: 'CR004',
            name: 'Risk Assessment Summary',
            type: 'RISK',
            date: '2024-01-05',
            status: 'READY',
            size: '3.2 MB',
            generatedBy: 'Emily Davis',
            description: 'Quarterly risk assessment with mitigation strategies',
            recordCount: 45
          },
          {
            id: 'CR005',
            name: 'Security Audit Report',
            type: 'SECURITY',
            date: '2023-12-28',
            status: 'FAILED',
            size: '-',
            generatedBy: 'System',
            description: 'Failed security audit - requires immediate attention',
            recordCount: 0,
            error: 'Database connection timeout during generation'
          },
          {
            id: 'CR006',
            name: 'Data Privacy Compliance',
            type: 'PRIVACY',
            date: '2023-12-20',
            status: 'READY',
            size: '1.5 MB',
            generatedBy: 'Robert Wilson',
            description: 'GDPR and data privacy compliance assessment',
            recordCount: 2340
          }
        ]
        setReports(complianceReports)
        setLoading(false)
      }, 1000)
    }
    fetchReports()
  }, [])

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || report.type === filterType
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedReports = filteredReports.slice(startIndex, endIndex)

  const handleDownloadReport = (report) => {
    // Simulate report download
    const reportData = mockAuditLogs
      .filter(log => log.action === report.type || true)
      .slice(0, 100) // Limit for demo
    
    const csvContent = [
      ['Timestamp', 'Action', 'Actor', 'Entity', 'Description', 'Severity'],
      ...reportData.map(log => [
        log.timestamp,
        log.action,
        log.actorName,
        `${log.entityType}:${log.entityId}`,
        log.description,
        log.severity
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${report.name.toLowerCase().replace(/\s+/g, '-')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'READY': return 'success'
      case 'PROCESSING': return 'warning'
      case 'FAILED': return 'danger'
      default: return 'default'
    }
  }

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'TRANSACTION': return 'info'
      case 'ADMIN': return 'premium'
      case 'ACCOUNT': return 'active'
      case 'RISK': return 'warning'
      case 'SECURITY': return 'danger'
      case 'PRIVACY': return 'default'
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

  const readyReports = reports.filter(r => r.status === 'READY').length
  const processingReports = reports.filter(r => r.status === 'PROCESSING').length
  const failedReports = reports.filter(r => r.status === 'FAILED').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Audit & Compliance Reports</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const csvContent = [
                ['Report ID', 'Name', 'Type', 'Status', 'Date', 'Generated By', 'Size', 'Record Count'],
                ...filteredReports.map(report => [
                  report.id,
                  report.name,
                  report.type,
                  report.status,
                  report.date,
                  report.generatedBy,
                  report.size,
                  report.recordCount || 0
                ])
              ].map(row => row.join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'compliance-reports.csv'
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
              <p className="text-sm font-medium text-white">Total Reports</p>
              <p className="text-2xl font-bold text-white">{reports.length}</p>
            </div>
            <FileText className="w-8 h-8 text-white/70" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Ready</p>
              <p className="text-2xl font-bold text-white">{readyReports}</p>
            </div>
            <Shield className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Processing</p>
              <p className="text-2xl font-bold text-white">{processingReports}</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Failed</p>
              <p className="text-2xl font-bold text-white">{failedReports}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-400" />
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
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
          >
            <option value="all">All Types</option>
            <option value="TRANSACTION">Transaction</option>
            <option value="ADMIN">Admin</option>
            <option value="ACCOUNT">Account</option>
            <option value="RISK">Risk</option>
            <option value="SECURITY">Security</option>
            <option value="PRIVACY">Privacy</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
          >
            <option value="all">All Status</option>
            <option value="READY">Ready</option>
            <option value="PROCESSING">Processing</option>
            <option value="FAILED">Failed</option>
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
              <option value="all">All Date Ranges</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <select
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
            >
              <option value="all">All Generators</option>
              <option value="system">System</option>
              <option value="admin">Admin Users</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        )}
      </Card>

      {/* Reports Table */}
      <Card>
        <Table
          columns={[
            {
              key: 'name',
              label: 'Report Name',
              render: (value, row) => (
                <div>
                  <div className="text-sm font-medium text-white">{value}</div>
                  <div className="text-sm text-white/70">{row.description}</div>
                </div>
              )
            },
            {
              key: 'type',
              label: 'Type',
              render: (value) => (
                <Badge variant={getTypeBadgeVariant(value)}>
                  {value}
                </Badge>
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
              key: 'date',
              label: 'Generated Date',
              render: (value) => (
                <span className="text-sm text-white">
                  {new Date(value).toLocaleDateString()}
                </span>
              )
            },
            {
              key: 'generatedBy',
              label: 'Generated By',
              render: (value) => (
                <span className="text-sm text-white">{value}</span>
              )
            },
            {
              key: 'recordCount',
              label: 'Records',
              render: (value) => (
                <span className="text-sm text-white">{value?.toLocaleString() || 'N/A'}</span>
              )
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (_, row) => (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedReport(row)
                      setShowPreviewModal(true)
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownloadReport(row)}
                    className="inline-flex items-center px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    disabled={row.status !== 'READY'}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </button>
                </div>
              )
            }
          ]}
          data={paginatedReports}
        />
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm text-white">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredReports.length)} of {filteredReports.length} reports
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

      {/* Report Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Report Preview"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Report Name</label>
              <input
                type="text"
                value={selectedReport?.name || ''}
                disabled
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Status</label>
              <input
                type="text"
                value={selectedReport?.status || ''}
                disabled
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Generated Date</label>
              <input
                type="text"
                value={selectedReport?.date || ''}
                disabled
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Generated By</label>
              <input
                type="text"
                value={selectedReport?.generatedBy || ''}
                disabled
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Description</label>
            <textarea
              value={selectedReport?.description || ''}
              disabled
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white/50"
            />
          </div>
          {selectedReport?.error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-sm text-red-200">
                <strong>Error:</strong> {selectedReport.error}
              </p>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
            {selectedReport?.status === 'READY' && (
              <button
                onClick={() => {
                  handleDownloadReport(selectedReport)
                  setShowPreviewModal(false)
                }}
                className="px-4 py-2 bg-[#2D8C5B] text-white rounded-lg hover:bg-[#247349] transition-colors"
              >
                Download Report
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ComplianceReports
