import React, { useState, useEffect } from 'react'
import { CreditCard, Shield, Eye, Settings, Lock, Unlock, Plus, Search, Download } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { mockCards } from '../mock-data/index.js'

const CardManagement = () => {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCard, setSelectedCard] = useState(null)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [newLimit, setNewLimit] = useState('')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [filterCardType, setFilterCardType] = useState('all')
  const [filterMinBalance, setFilterMinBalance] = useState('')
  const [filterMaxBalance, setFilterMaxBalance] = useState('')

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true)
      setTimeout(() => {
        setCards(mockCards)
        setLoading(false)
      }, 1000)
    }
    fetchCards()
  }, [])

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.cardType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || card.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesCardType = filterCardType === 'all' || card.cardType.toLowerCase() === filterCardType.toLowerCase()
    const matchesMinBalance = !filterMinBalance || card.currentBalance >= parseFloat(filterMinBalance)
    const matchesMaxBalance = !filterMaxBalance || card.currentBalance <= parseFloat(filterMaxBalance)
    
    return matchesSearch && matchesStatus && matchesCardType && matchesMinBalance && matchesMaxBalance
  })

  const handleCardAction = (action, card) => {
    switch (action) {
      case 'view':
        setSelectedCard(card)
        break
      case 'block':
        if (confirm(`Are you sure you want to permanently block card ending in ${card.cardNumber.slice(-4)}?`)) {
          setCards(cards.map(c => 
            c.id === card.id ? { ...c, status: 'BLOCKED', blockedByAdmin: true } : c
          ))
        }
        break
      case 'freeze':
        setCards(cards.map(c => 
          c.id === card.id ? { ...c, status: 'FROZEN', frozenByAdmin: true, freezeReason: 'Administrative freeze' } : c
        ))
        break
      case 'unfreeze':
        setCards(cards.map(c => 
          c.id === card.id ? { ...c, status: 'ACTIVE', frozenByAdmin: false, freezeReason: null } : c
        ))
        break
      case 'limit':
        setSelectedCard(card)
        setNewLimit(card.spendingLimit.toString())
        setShowLimitModal(true)
        break
    }
  }

  const confirmLimitUpdate = () => {
    const limit = parseFloat(newLimit)
    if (!isNaN(limit) && limit >= 0 && limit <= 1000000) {
      setCards(cards.map(c => 
        c.id === selectedCard.id ? { ...c, spendingLimit: limit } : c
      ))
      setShowLimitModal(false)
      setNewLimit('')
      setSelectedCard(null)
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
        <h2 className="text-2xl font-bold text-black">Card Management</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const csvContent = [
                ['Card Number', 'Holder Name', 'Card Type', 'Status', 'Balance', 'Created Date'],
                ...filteredCards.map(card => [
                  card.cardNumber,
                  card.holderName,
                  card.cardType,
                  card.status,
                  card.currentBalance,
                  card.createdAt
                ])
              ].map(row => row.join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'card-history.csv'
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
              <p className="text-sm font-medium text-white">Total Cards</p>
              <p className="text-2xl font-bold text-white">{cards.length}</p>
            </div>
            <CreditCard className="w-8 h-8 text-white" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Active</p>
              <p className="text-2xl font-bold text-white">
                {cards.filter(c => c.status === 'ACTIVE').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-white" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Frozen</p>
              <p className="text-2xl font-bold text-white">
                {cards.filter(c => c.status === 'FROZEN').length}
              </p>
            </div>
            <Lock className="w-8 h-8 text-white" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Blocked</p>
              <p className="text-2xl font-bold text-white">
                {cards.filter(c => c.status === 'BLOCKED').length}
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
                placeholder="Search cards..."
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
            <option value="frozen">Frozen</option>
            <option value="blocked">Blocked</option>
          </select>
          <select
            value={filterCardType}
            onChange={(e) => setFilterCardType(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-black"
          >
            <option value="all">All Types</option>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="amex">Amex</option>
          </select>
          <button 
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="inline-flex items-center justify-center px-4 py-2 bg-[#FFFFFF01] border border-white/20 rounded-lg shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 text-white transition-all duration-200"
          >
            <Settings className="w-5 h-5 mr-2" />
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

      {/* Cards Table */}
      <Card>
        <Table
          columns={[
            {
              key: 'cardNumber',
              label: 'Card Number',
              render: (value) => `**** ${value.slice(-4)}`
            },
            {
              key: 'cardType',
              label: 'Type',
              render: (value) => (
                <Badge variant="default">
                  {value}
                </Badge>
              )
            },
            {
              key: 'holderName',
              label: 'Cardholder',
              render: (value) => value
            },
            {
              key: 'expiryDate',
              label: 'Expiry',
              render: (value) => value
            },
            {
              key: 'spendingLimit',
              label: 'Limit',
              render: (value) => `ETB ${value.toLocaleString()}`
            },
            {
              key: 'currentBalance',
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
                    onClick={() => handleCardAction('view', row)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </button>
                  {row.status === 'ACTIVE' ? (
                    <>
                      <button 
                        onClick={() => handleCardAction('freeze', row)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        Freeze
                      </button>
                      <button 
                        onClick={() => handleCardAction('block', row)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        Block
                      </button>
                    </>
                  ) : row.status === 'FROZEN' ? (
                    <button 
                      onClick={() => handleCardAction('unfreeze', row)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                    >
                      <Unlock className="w-3 h-3 mr-1" />
                      Unfreeze
                    </button>
                  ) : null}
                  <button 
                    onClick={() => handleCardAction('limit', row)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFFFFF01] border border-white/20 rounded-md shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 transition-all duration-200"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Limit
                  </button>
                </div>
              )
            }
          ]}
          data={filteredCards}
          loading={loading}
        />
      </Card>

      {/* Card Details Modal */}
      <Modal
        isOpen={!!selectedCard && !showBlockModal && !showLimitModal}
        onClose={() => setSelectedCard(null)}
        title="Card Details"
        size="lg"
      >
        {selectedCard && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white">Card Number</label>
                <p className="mt-1 text-sm text-white">**** {selectedCard.cardNumber.slice(-4)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Card Type</label>
                <Badge variant="default">{selectedCard.cardType}</Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Cardholder</label>
                <p className="mt-1 text-sm text-white">{selectedCard.holderName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Status</label>
                <Badge 
                  variant={
                    selectedCard.status === 'ACTIVE' ? 'success' :
                    selectedCard.status === 'FROZEN' ? 'warning' : 'error'
                  }
                >
                  {selectedCard.status}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Expiry Date</label>
                <p className="mt-1 text-sm text-white">{selectedCard.expiryDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Spending Limit</label>
                <p className="mt-1 text-sm text-white">ETB {selectedCard.spendingLimit.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Current Balance</label>
                <p className="mt-1 text-sm text-white">ETB {selectedCard.currentBalance.toLocaleString()}</p>
              </div>
            </div>
            {selectedCard.frozenByAdmin && (
              <div>
                <label className="block text-sm font-medium text-white">Freeze Reason</label>
                <p className="mt-1 text-sm text-red-400">{selectedCard.freezeReason}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-white">Last Used</label>
              <p className="mt-1 text-sm text-white">{new Date(selectedCard.lastUsedAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Spending Limit Modal */}
      <Modal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        title="Update Spending Limit"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">New Spending Limit (ETB)</label>
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
              placeholder="Enter new spending limit"
              min="0"
              max="1000000"
              step="100"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowLimitModal(false)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmLimitUpdate}
              className="px-4 py-2 bg-[#FFFFFF01] border border-white/20 rounded-lg shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 text-white transition-all duration-200"
            >
              Update Limit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CardManagement
