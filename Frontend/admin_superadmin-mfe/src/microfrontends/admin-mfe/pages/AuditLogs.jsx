import React, { useState, useEffect } from 'react'
import { Search, Filter, Download, FileText, User, Shield, AlertTriangle } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'
import Badge from '../components/Badge'
import { mockAuditLogs } from '../mock-data/index.js'

const AuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [filterUser, setFilterUser] = useState('all')
  const [filterEntity, setFilterEntity] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      setTimeout(() => {
        setLogs(mockAuditLogs)
        setLoading(false)
      }, 1000)
    }
    fetchLogs()
  }, [])

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.entityId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = filterAction === 'all' || log.action.toLowerCase().includes(filterAction.toLowerCase())
    const matchesUser = filterUser === 'all' || log.actorRole.toLowerCase() === filterUser.toLowerCase()
    const matchesEntity = filterEntity === 'all' || log.entityType.toLowerCase() === filterEntity.toLowerCase()
    const matchesSeverity = filterSeverity === 'all' || log.severity.toLowerCase() === filterSeverity.toLowerCase()
    const matchesDateFrom = !filterDateFrom || new Date(log.timestamp) >= new Date(filterDateFrom)
    const matchesDateTo = !filterDateTo || new Date(log.timestamp) <= new Date(filterDateTo)
    
    return matchesSearch && matchesAction && matchesUser && matchesEntity && matchesSeverity && matchesDateFrom && matchesDateTo
  })

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <FileText className="w-4 h-4 text-blue-500" />
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
        <h2 className="text-2xl font-bold text-black">Audit Logs</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const csvContent = [
                ['Timestamp', 'Action', 'Actor', 'Entity', 'Description', 'Severity'],
                ...filteredLogs.map(log => [
                  log.timestamp,
                  log.action,
                  log.actorRole,
                  `${log.entityType}:${log.entityId}`,
                  log.description,
                  log.severity
                ])
              ].map(row => row.join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'audit-logs.csv'
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
              <p className="text-sm font-medium text-white">Total Logs</p>
              <p className="text-2xl font-bold text-white">{logs.length}</p>
            </div>
            <FileText className="w-8 h-8 text-white" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Critical</p>
              <p className="text-2xl font-bold text-white">
                {logs.filter(l => l.severity === 'CRITICAL').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Warnings</p>
              <p className="text-2xl font-bold text-white">
                {logs.filter(l => l.severity === 'WARNING').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Admin Actions</p>
              <p className="text-2xl font-bold text-white">
                {logs.filter(l => l.actorRole === 'ADMIN').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-white" />
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
                placeholder="Search audit logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
              />
            </div>
          </div>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
          >
            <option value="all">All Actions</option>
            <option value="login">Login</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
          >
            <option value="all">All Users</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
            <option value="system">System</option>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/20">
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
            >
              <option value="all">All Entities</option>
              <option value="user">User</option>
              <option value="account">Account</option>
              <option value="card">Card</option>
              <option value="transaction">Transaction</option>
              <option value="system">System</option>
            </select>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
            >
              <option value="all">All Severities</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
            />
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
            />
          </div>
        )}
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <Table
          columns={[
            {
              key: 'timestamp',
              label: 'Date & Time',
              render: (value) => new Date(value).toLocaleString()
            },
            {
              key: 'actorRole',
              label: 'Actor',
              render: (value) => (
                <div className="flex items-center">
                  <Badge 
                    variant={
                      value === 'ADMIN' ? 'success' :
                      value === 'SUPER_ADMIN' ? 'warning' : 'default'
                    }
                  >
                    {value}
                  </Badge>
                </div>
              )
            },
            {
              key: 'action',
              label: 'Action',
              render: (value) => value
            },
            {
              key: 'entityType',
              label: 'Entity',
              render: (value) => (
                <Badge variant="default">
                  {value}
                </Badge>
              )
            },
            {
              key: 'entityId',
              label: 'Entity ID',
              render: (value) => value
            },
            {
              key: 'description',
              label: 'Description',
              render: (value) => value
            },
            {
              key: 'severity',
              label: 'Severity',
              render: (value) => (
                <div className="flex items-center">
                  {getSeverityIcon(value)}
                  <Badge 
                    variant={
                      value === 'CRITICAL' ? 'error' :
                      value === 'WARNING' ? 'warning' : 'info'
                    }
                  >
                    {value}
                  </Badge>
                </div>
              )
            },
            {
              key: 'ipAddress',
              label: 'IP Address',
              render: (value) => value
            }
          ]}
          data={filteredLogs}
          loading={loading}
        />
      </Card>
    </div>
  )
}

export default AuditLogs
