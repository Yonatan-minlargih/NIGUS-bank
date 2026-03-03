import React, { useState, useEffect } from 'react'
import { Search, Filter, Download, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Flag, RefreshCw, Eye } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { mockTransactions } from '../mock-data/index.js'

const TransactionMonitoring = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [amountMin, setAmountMin] = useState('')
  const [amountMax, setAmountMax] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showFlagModal, setShowFlagModal] = useState(false)
  const [showReverseModal, setShowReverseModal] = useState(false)
  const [flagReason, setFlagReason] = useState('')
  const [reverseReason, setReverseReason] = useState('')

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      setTimeout(() => {
        setTransactions(mockTransactions)
        setLoading(false)
      }, 1000)
    }
    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || txn.type.toLowerCase() === filterType.toLowerCase()
    const matchesStatus = filterStatus === 'all' || txn.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesAmountMin = !amountMin || txn.amount >= parseFloat(amountMin)
    const matchesAmountMax = !amountMax || txn.amount <= parseFloat(amountMax)
    const matchesDateFrom = !dateFrom || new Date(txn.timestamp) >= new Date(dateFrom)
    const matchesDateTo = !dateTo || new Date(txn.timestamp) <= new Date(dateTo)
    
    return matchesSearch && matchesType && matchesStatus && matchesAmountMin && matchesAmountMax && matchesDateFrom && matchesDateTo
  })

  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'Completed').length,
    pending: transactions.filter(t => t.status === 'Pending').length,
    flagged: transactions.filter(t => t.flagged).length,
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0)
  }

  const handleTransactionAction = (action, transaction) => {
    switch (action) {
      case 'view':
        setSelectedTransaction(transaction)
        break
      case 'flag':
        setSelectedTransaction(transaction)
        setShowFlagModal(true)
        break
      case 'unflag':
        setTransactions(transactions.map(tx => 
          tx.id === transaction.id ? { ...tx, flagged: false, flaggedBy: null } : tx
        ))
        break
      case 'reverse':
        if (transaction.status === 'SUCCESS') {
          setSelectedTransaction(transaction)
          setShowReverseModal(true)
        } else {
          alert('Only successful transactions can be reversed')
        }
        break
    }
  }

  const confirmFlag = () => {
    if (flagReason.trim()) {
      setTransactions(transactions.map(tx => 
        tx.id === selectedTransaction.id ? { ...tx, flagged: true, flaggedBy: 'ADMIN' } : tx
      ))
      setShowFlagModal(false)
      setFlagReason('')
      setSelectedTransaction(null)
    }
  }

  const confirmReverse = () => {
    if (reverseReason.trim()) {
      // Create reversal transaction
      const reversalTransaction = {
        id: `rev_${Date.now()}`,
        transactionId: `TXN${Date.now()}`,
        userName: selectedTransaction.userName,
        amount: selectedTransaction.amount,
        type: selectedTransaction.type === 'DEPOSIT' ? 'WITHDRAWAL' : 'DEPOSIT',
        status: 'SUCCESS',
        description: `Reversal of ${selectedTransaction.transactionId}`,
        timestamp: new Date().toISOString(),
        flagged: false,
        ipAddress: '192.168.1.50',
        location: 'Addis Ababa, Ethiopia'
      }
      
      // Update original transaction
      setTransactions([
        ...transactions.map(tx => 
          tx.id === selectedTransaction.id ? { ...tx, status: 'REVERSED', reversedReference: reversalTransaction.transactionId } : tx
        ),
        reversalTransaction
      ])
      
      setShowReverseModal(false)
      setReverseReason('')
      setSelectedTransaction(null)
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
        <h2 className="text-2xl font-bold text-black">Transaction Monitoring</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const csvContent = [
                ['Transaction ID', 'User', 'Type', 'Amount', 'Status', 'Date', 'Description'],
                ...filteredTransactions.map(tx => [
                  tx.transactionId,
                  tx.userName,
                  tx.type,
                  tx.amount,
                  tx.status,
                  tx.timestamp,
                  tx.description
                ])
              ].map(row => row.join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'transaction-history.csv'
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
              <p className="text-sm font-medium text-white">Total Transactions</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Completed</p>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
            </div>
            <ArrowUpRight className="w-8 h-8 text-white" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Pending</p>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Flagged</p>
              <p className="text-2xl font-bold text-white">{stats.flagged}</p>
            </div>
            <Flag className="w-8 h-8 text-white" />
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
                placeholder="Search transactions..."
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
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="reversed">Reversed</option>
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
            <input
              type="number"
              placeholder="Min Amount"
              value={amountMin}
              onChange={(e) => setAmountMin(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={amountMax}
              onChange={(e) => setAmountMax(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
            />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
            />
          </div>
        )}
      </Card>

      {/* Transactions Table */}
      <Card>
        <Table
          columns={[
            {
              key: 'transactionId',
              label: 'Transaction ID',
              render: (value) => value
            },
            {
              key: 'userName',
              label: 'User',
              render: (value) => value
            },
            {
              key: 'type',
              label: 'Type',
              render: (value) => (
                <Badge 
                  variant={
                    value === 'DEPOSIT' ? 'success' :
                    value === 'WITHDRAWAL' ? 'error' : 'info'
                  }
                >
                  {value}
                </Badge>
              )
            },
            {
              key: 'amount',
              label: 'Amount',
              render: (value) => `ETB ${value.toLocaleString()}`
            },
            {
              key: 'description',
              label: 'Description',
              render: (value) => value
            },
            {
              key: 'timestamp',
              label: 'Date',
              render: (value) => new Date(value).toLocaleDateString()
            },
            {
              key: 'status',
              label: 'Status',
              render: (value) => (
                <Badge 
                  variant={
                    value === 'SUCCESS' ? 'success' :
                    value === 'PENDING' ? 'warning' :
                    value === 'REVERSED' ? 'info' : 'error'
                  }
                >
                  {value}
                </Badge>
              )
            },
            {
              key: 'flagged',
              label: 'Flagged',
              render: (value) => (
                <Badge variant={value ? 'error' : 'default'}>
                  {value ? 'Yes' : 'No'}
                </Badge>
              )
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (_, row) => (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleTransactionAction('view', row)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </button>
                  {row.flagged ? (
                    <button 
                      onClick={() => handleTransactionAction('unflag', row)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                    >
                      <Flag className="w-3 h-3 mr-1" />
                      Unflag
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleTransactionAction('flag', row)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                    >
                      <Flag className="w-3 h-3 mr-1" />
                      Flag
                    </button>
                  )}
                  {row.status === 'SUCCESS' && (
                    <button 
                      onClick={() => handleTransactionAction('reverse', row)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Reverse
                    </button>
                  )}
                </div>
              )
            }
          ]}
          data={filteredTransactions}
          loading={loading}
        />
      </Card>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={!!selectedTransaction && !showFlagModal && !showReverseModal}
        onClose={() => setSelectedTransaction(null)}
        title="Transaction Details"
        size="lg"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white">Transaction ID</label>
                <p className="mt-1 text-sm text-white">{selectedTransaction.transactionId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">User</label>
                <p className="mt-1 text-sm text-white">{selectedTransaction.userName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Type</label>
                <Badge 
                  variant={
                    selectedTransaction.type === 'DEPOSIT' ? 'success' :
                    selectedTransaction.type === 'WITHDRAWAL' ? 'error' : 'info'
                  }
                >
                  {selectedTransaction.type}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Amount</label>
                <p className="mt-1 text-sm text-white">ETB {selectedTransaction.amount.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Status</label>
                <Badge 
                  variant={
                    selectedTransaction.status === 'SUCCESS' ? 'success' :
                    selectedTransaction.status === 'PENDING' ? 'warning' : 'error'
                  }
                >
                  {selectedTransaction.status}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Date</label>
                <p className="mt-1 text-sm text-white">{new Date(selectedTransaction.timestamp).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Location</label>
                <p className="mt-1 text-sm text-white">{selectedTransaction.location}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Description</label>
              <p className="mt-1 text-sm text-white">{selectedTransaction.description}</p>
            </div>
            {selectedTransaction.reversedReference && (
              <div>
                <label className="block text-sm font-medium text-white">Reversed By</label>
                <p className="mt-1 text-sm text-red-400">{selectedTransaction.reversedReference}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Flag Modal */}
      <Modal
        isOpen={showFlagModal}
        onClose={() => setShowFlagModal(false)}
        title="Flag Transaction"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Flag Reason</label>
            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
              rows={3}
              placeholder="Enter reason for flagging this transaction..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowFlagModal(false)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmFlag}
              className="px-4 py-2 bg-[#FFFFFF01] border border-white/20 rounded-lg shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 text-white transition-all duration-200"
            >
              Flag Transaction
            </button>
          </div>
        </div>
      </Modal>

      {/* Reverse Modal */}
      <Modal
        isOpen={showReverseModal}
        onClose={() => setShowReverseModal(false)}
        title="Reverse Transaction"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Reverse Reason</label>
            <textarea
              value={reverseReason}
              onChange={(e) => setReverseReason(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
              rows={3}
              placeholder="Enter reason for reversing this transaction..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowReverseModal(false)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmReverse}
              className="px-4 py-2 bg-[#FFFFFF01] border border-white/20 rounded-lg shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 text-white transition-all duration-200"
            >
              Reverse Transaction
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TransactionMonitoring
