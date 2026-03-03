import React, { useState, useEffect } from 'react'
import { Users, CreditCard, FileText, TrendingUp, Activity, DollarSign } from 'lucide-react'
import Card from '../components/Card'
import Table from '../components/Table'
import Badge from '../components/Badge'
import { mockUsers, mockAccounts, mockTransactions, mockCards } from '../mock-data/index.js'

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalTransactionsToday: 0,
    totalDepositsToday: 0,
    totalWithdrawalsToday: 0,
    suspiciousActivityAlerts: 0,
    frozenAccountsCount: 0,
    blockedCardsCount: 0
  })

  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // Simulate API call with mock data
      setTimeout(() => {
        // Calculate stats from mock data
        const today = new Date().toISOString().split('T')[0]
        const todayTransactions = mockTransactions.filter(tx => 
          tx.timestamp.startsWith(today)
        )
        
        const totalDepositsToday = todayTransactions
          .filter(tx => tx.type === 'DEPOSIT' && tx.status === 'SUCCESS')
          .reduce((sum, tx) => sum + tx.amount, 0)
          
        const totalWithdrawalsToday = todayTransactions
          .filter(tx => tx.type === 'WITHDRAWAL' && tx.status === 'SUCCESS')
          .reduce((sum, tx) => sum + tx.amount, 0)

        setStats({
          totalUsers: mockUsers.length,
          totalAccounts: mockAccounts.length,
          totalTransactionsToday: todayTransactions.length,
          totalDepositsToday,
          totalWithdrawalsToday,
          suspiciousActivityAlerts: mockTransactions.filter(tx => tx.flagged).length,
          frozenAccountsCount: mockAccounts.filter(acc => acc.status === 'FROZEN').length,
          blockedCardsCount: mockCards.filter(card => card.status === 'BLOCKED').length
        })
        
        setRecentTransactions(mockTransactions.slice(0, 5))
        setLoading(false)
      }, 1000)
    }

    fetchData()
  }, [])

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-white'
    },
    {
      title: 'Total Accounts',
      value: stats.totalAccounts.toLocaleString(),
      icon: CreditCard,
      color: 'text-white'
    },
    {
      title: 'Transactions Today',
      value: stats.totalTransactionsToday.toLocaleString(),
      icon: FileText,
      color: 'text-white'
    },
    {
      title: 'Deposits Today',
      value: `ETB ${stats.totalDepositsToday.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-white'
    },
    {
      title: 'Withdrawals Today',
      value: `ETB ${stats.totalWithdrawalsToday.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-white'
    },
    {
      title: 'Suspicious Activity',
      value: stats.suspiciousActivityAlerts.toLocaleString(),
      icon: Activity,
      color: 'text-white'
    },
    {
      title: 'Frozen Accounts',
      value: stats.frozenAccountsCount.toLocaleString(),
      icon: CreditCard,
      color: 'bg-indigo-500',
      change: 'Frozen',
      changeType: 'warning'
    },
    {
      title: 'Blocked Cards',
      value: stats.blockedCardsCount.toLocaleString(),
      icon: CreditCard,
      color: 'bg-pink-500',
      change: 'Blocked',
      changeType: 'error'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-white mr-1" />
                  <span className={`text-sm ${
                    stat.changeType === 'warning' ? 'text-yellow-600' :
                    stat.changeType === 'error' ? 'text-red-600' : 'text-white'
                  }`}>{stat.change}</span>
                  <span className="text-sm text-white ml-1">from last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        </div>
        <Table
          columns={[
            {
              key: 'transactionId',
              label: 'Transaction ID',
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
              key: 'userName',
              label: 'User',
              render: (value) => value
            },
            {
              key: 'amount',
              label: 'Amount',
              render: (value) => `ETB ${value.toLocaleString()}`
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
                    value === 'PENDING' ? 'warning' : 'error'
                  }
                >
                  {value}
                </Badge>
              )
            }
          ]}
          data={recentTransactions}
          loading={loading}
        />
      </Card>

      {/* Alerts Panel */}
      {stats.suspiciousActivityAlerts > 0 && (
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Security Alerts</h3>
          </div>
          <div className="space-y-3">
            {mockTransactions.filter(tx => tx.flagged).slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-white/10">
                <div>
                  <div className="flex items-center">
                    <Badge variant="warning">Flagged</Badge>
                    <span className="ml-2 font-medium text-white">{transaction.transactionId}</span>
                  </div>
                  <p className="text-sm text-white/70 mt-1">{transaction.description}</p>
                </div>
                <div className="text-xs text-white/50">
                  {new Date(transaction.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Frozen Accounts */}
      {stats.frozenAccountsCount > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <button className="inline-flex items-center px-4 py-2 bg-[#FFFFFF01] border border-white/20 rounded-lg shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-white/10 text-white transition-all duration-200">
              <Activity className="w-5 h-5 mr-2" />
              Refresh
            </button>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Frozen Accounts</h3>
          </div>
          <div className="space-y-3">
            {mockAccounts.filter(acc => acc.status === 'FROZEN').slice(0, 3).map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 rounded-lg bg-white/10">
                <div>
                  <div className="flex items-center">
                    <Badge variant="warning">Frozen</Badge>
                    <span className="ml-2 font-medium text-white">{account.accountName}</span>
                  </div>
                  <p className="text-sm text-white/70 mt-1">{account.freezeReason}</p>
                </div>
                <div className="text-xs text-white/50">
                  {new Date(account.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Blocked Cards */}
      {stats.blockedCardsCount > 0 && (
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Blocked Cards</h3>
          </div>
          <div className="space-y-3">
            {mockCards.filter(card => card.status === 'BLOCKED').map((card) => (
              <div key={card.id} className="flex items-center justify-between p-3 rounded-lg">
                <div>
                  <div className="flex items-center">
                    <Badge variant="error">Blocked</Badge>
                    <span className="ml-2 font-medium text-white">**** {card.cardNumber.slice(-4)}</span>
                  </div>
                  <p className="text-sm text-white/70 mt-1">{card.holderName}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(card.lastUsedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default DashboardHome
