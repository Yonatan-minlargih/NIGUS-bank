import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, CreditCard, TrendingUp, Eye, Lock, Unlock, X, RefreshCw, Download } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { mockAccounts } from '../mock-data/index.js'

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [filterMinBalance, setFilterMinBalance] = useState('')
  const [filterMaxBalance, setFilterMaxBalance] = useState('')
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [showFreezeModal, setShowFreezeModal] = useState(false)
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [freezeReason, setFreezeReason] = useState('')
  const [newInterestRate, setNewInterestRate] = useState('')

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true)
      setTimeout(() => {
        setAccounts(mockAccounts)
        setLoading(false)
      }, 1000)
    }
    fetchAccounts()
  }, [])

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || account.accountType.toLowerCase() === filterType.toLowerCase()
    const matchesMinBalance = !filterMinBalance || account.balance >= parseFloat(filterMinBalance)
    const matchesMaxBalance = !filterMaxBalance || account.balance <= parseFloat(filterMaxBalance)
    
    return matchesSearch && matchesFilter && matchesMinBalance && matchesMaxBalance
  })

  const handleAccountAction = (action, account) => {
    switch (action) {
      case 'view':
        setSelectedAccount(account)
        break
      case 'freeze':
        setSelectedAccount(account)
        setShowFreezeModal(true)
        break
      case 'unfreeze':
        setAccounts(accounts.map(acc => 
          acc.id === account.id ? { ...acc, status: 'ACTIVE', frozenByAdmin: false, freezeReason: null } : acc
        ))
        break
      case 'close':
        if (confirm(`Are you sure you want to close account ${account.accountNumber}?`)) {
          setAccounts(accounts.map(acc => 
            acc.id === account.id ? { ...acc, status: 'CLOSED' } : acc
          ))
        }
        break
      case 'reopen':
        setAccounts(accounts.map(acc => 
          acc.id === account.id ? { ...acc, status: 'ACTIVE' } : acc
        ))
        break
      case 'interest':
        setSelectedAccount(account)
        setNewInterestRate(account.interestRate.toString())
        setShowInterestModal(true)
        break
    }
  }

  const confirmFreeze = () => {
    if (freezeReason.trim()) {
      setAccounts(accounts.map(acc => 
        acc.id === selectedAccount.id ? { ...acc, status: 'FROZEN', frozenByAdmin: true, freezeReason } : acc
      ))
      setShowFreezeModal(false)
      setFreezeReason('')
      setSelectedAccount(null)
    }
  }

  const confirmInterestUpdate = () => {
    const rate = parseFloat(newInterestRate)
    if (!isNaN(rate) && rate >= 0 && rate <= 20) {
      setAccounts(accounts.map(acc => 
        acc.id === selectedAccount.id ? { ...acc, interestRate: rate } : acc
      ))
      setShowInterestModal(false)
      setNewInterestRate('')
      setSelectedAccount(null)
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
        <h2 className="text-2xl font-bold text-black">Account Management</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const csvContent = [
                ['Account Number', 'Account Name', 'Owner Name', 'Type', 'Balance', 'Status'],
                ...filteredAccounts.map(acc => [
                  acc.accountNumber,
                  acc.accountName,
                  acc.ownerName,
                  acc.accountType,
                  acc.balance,
                  acc.status
                ])
              ].map(row => row.join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'account-history.csv'
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Total Accounts</p>
              <p className="text-2xl font-bold text-white">{accounts.length}</p>
            </div>
            <CreditCard className="w-8 h-8 text-white" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Active Accounts</p>
              <p className="text-2xl font-bold text-white">
                {accounts.filter(acc => acc.status === 'ACTIVE').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Frozen Accounts</p>
              <p className="text-2xl font-bold text-white">
                {accounts.filter(acc => acc.status === 'FROZEN').length}
              </p>
            </div>
            <Lock className="w-8 h-8 text-white" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
              <input
                type="text"
                placeholder="Search accounts..."
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
            <option value="savings">Savings</option>
            <option value="current">Current</option>
            <option value="business">Business</option>
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
            <input
              type="number"
              placeholder="Min Balance"
              value={filterMinBalance}
              onChange={(e) => setFilterMinBalance(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
            />
            <input
              type="number"
              placeholder="Max Balance"
              value={filterMaxBalance}
              onChange={(e) => setFilterMaxBalance(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
            />
          </div>
        )}
      </Card>

      {/* Accounts Table */}
      <Card>
        <Table
          columns={[
            {
              key: 'accountNumber',
              label: 'Account Number',
              render: (value) => value
            },
            {
              key: 'accountName',
              label: 'Account Name',
              render: (value) => value
            },
            {
              key: 'ownerName',
              label: 'Owner',
              render: (value) => value
            },
            {
              key: 'accountType',
              label: 'Type',
              render: (value) => (
                <Badge variant="default">
                  {value}
                </Badge>
              )
            },
            {
              key: 'balance',
              label: 'Balance',
              render: (value) => `ETB ${value.toLocaleString()}`
            },
            {
              key: 'status',
              label: 'Status',
              render: (value) => (
                <Badge 
                  variant={
                    value === 'ACTIVE' ? 'success' :
                    value === 'FROZEN' ? 'warning' : 'error'
                  }
                >
                  {value}
                </Badge>
              )
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (_, row) => (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleAccountAction('view', row)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </button>
                  {row.status === 'ACTIVE' ? (
                    <>
                      <button 
                        onClick={() => handleAccountAction('freeze', row)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        Freeze
                      </button>
                      <button 
                        onClick={() => handleAccountAction('close', row)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Close
                      </button>
                    </>
                  ) : row.status === 'FROZEN' ? (
                    <button 
                      onClick={() => handleAccountAction('unfreeze', row)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                    >
                      <Unlock className="w-3 h-3 mr-1" />
                      Unfreeze
                    </button>
                  ) : row.status === 'CLOSED' ? (
                    <button 
                      onClick={() => handleAccountAction('reopen', row)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Reopen
                    </button>
                  ) : null}
                  {row.accountType === 'SAVINGS' && (
                    <button 
                      onClick={() => handleAccountAction('interest', row)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Rate
                    </button>
                  )}
                </div>
              )
            }
          ]}
          data={filteredAccounts}
          loading={loading}
        />
      </Card>

      {/* Account Details Modal */}
      <Modal
        isOpen={!!selectedAccount && !showFreezeModal && !showInterestModal}
        onClose={() => setSelectedAccount(null)}
        title="Account Details"
        size="lg"
      >
        {selectedAccount && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white">Account Number</label>
                <p className="mt-1 text-sm text-white">{selectedAccount.accountNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Account Type</label>
                <Badge variant="default">{selectedAccount.accountType}</Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Owner Name</label>
                <p className="mt-1 text-sm text-white">{selectedAccount.ownerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Balance</label>
                <p className="mt-1 text-sm text-white">ETB {selectedAccount.balance.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Status</label>
                <Badge
                  variant={
                    selectedAccount.status === 'ACTIVE' ? 'success' :
                    selectedAccount.status === 'FROZEN' ? 'warning' : 'error'
                  }
                >
                  {selectedAccount.status}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Interest Rate</label>
                <p className="mt-1 text-sm text-white">{selectedAccount.interestRate}%</p>
              </div>
            </div>
            {selectedAccount.frozenByAdmin && (
              <div>
                <label className="block text-sm font-medium text-white">Freeze Reason</label>
                <p className="mt-1 text-sm text-red-400">{selectedAccount.freezeReason}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-white">Created Date</label>
              <p className="mt-1 text-sm text-white">{new Date(selectedAccount.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Freeze Modal */}
      <Modal
        isOpen={showFreezeModal}
        onClose={() => setShowFreezeModal(false)}
        title="Freeze Account"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Freeze Reason</label>
            <textarea
              value={freezeReason}
              onChange={(e) => setFreezeReason(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
              rows={3}
              placeholder="Enter reason for freezing this account..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowFreezeModal(false)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmFreeze}
              className="px-4 py-2 bg-[#FFFFFF01] border border-white/20 rounded-lg shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 text-white transition-all duration-200"
            >
              Freeze Account
            </button>
          </div>
        </div>
      </Modal>

      {/* Interest Rate Modal */}
      <Modal
        isOpen={showInterestModal}
        onClose={() => setShowInterestModal(false)}
        title="Update Interest Rate"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">New Interest Rate (%)</label>
            <input
              type="number"
              value={newInterestRate}
              onChange={(e) => setNewInterestRate(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
              placeholder="Enter interest rate (0-20)"
              min="0"
              max="20"
              step="0.1"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowInterestModal(false)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmInterestUpdate}
              className="px-4 py-2 bg-[#FFFFFF01] border border-white/20 rounded-lg shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 text-white transition-all duration-200"
            >
              Update Rate
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AccountManagement
