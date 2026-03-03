import React, { useState, useEffect } from 'react'
import { Users, Server, AlertTriangle, Activity, FileText, Shield, TrendingUp, Cpu, Download, Settings } from 'lucide-react'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { mockSystemHealth } from '../mock-data/index.js'

const DashboardHome = () => {
  const [systemStats, setSystemStats] = useState({
    totalAdmins: 0,
    activeServices: 0,
    riskAlerts: 0,
    systemUptime: 0
  })

  const [serviceHealth, setServiceHealth] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setTimeout(() => {
        setSystemStats({
          totalAdmins: 12,
          activeServices: 8,
          riskAlerts: 3,
          systemUptime: 99.9
        })
        
        setServiceHealth(mockSystemHealth)
        setLoading(false)
      }, 1000)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const healthyServices = serviceHealth.filter(s => s.status === 'HEALTHY').length
  const warningServices = serviceHealth.filter(s => s.status === 'WARNING').length
  const errorServices = serviceHealth.filter(s => s.status === 'ERROR').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">SuperAdmin Dashboard</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const csvContent = [
                ['Service Name', 'Status', 'Response Time', 'Uptime', 'Last Check'],
                ...serviceHealth.map(service => [
                  service.serviceName,
                  service.status,
                  service.responseTime,
                  service.uptime,
                  service.lastCheck
                ])
              ].map(row => row.join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'system-health-report.csv'
              a.click()
              window.URL.revokeObjectURL(url)
            }}
            className="inline-flex items-center px-6 py-2.5 bg-[#2D8C5B] text-white rounded-xl shadow-[0px_4px_6px_-4px_#0000001A] hover:shadow-[0px_10px_15px_-3px_#0000001A] hover:bg-[#247349] transition-all duration-200"
            style={{ width: '200.61000061035156px', height: '44px', gap: '8px', borderRadius: '12px', paddingTop: '10px', paddingRight: '24px', paddingBottom: '10px', paddingLeft: '24px' }}
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Total Admins</p>
              <p className="text-2xl font-bold text-white">{systemStats.totalAdmins}</p>
            </div>
            <Users className="w-8 h-8 text-white/70" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Active Services</p>
              <p className="text-2xl font-bold text-white">{systemStats.activeServices}</p>
            </div>
            <Server className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Risk Alerts</p>
              <p className="text-2xl font-bold text-white">{systemStats.riskAlerts}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">System Uptime</p>
              <p className="text-2xl font-bold text-white">{systemStats.systemUptime}%</p>
            </div>
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
      </div>

      {/* Service Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Service Health</h3>
          <div className="space-y-3">
            {serviceHealth.slice(0, 6).map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    service.status === 'HEALTHY' ? 'bg-green-400' :
                    service.status === 'WARNING' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`} />
                  <span className="text-sm text-white">{service.serviceName}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/70">{service.responseTime}ms</div>
                  <div className="text-xs text-white/70">{service.uptime}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Healthy Services</span>
              <Badge variant="success">{healthyServices}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Warning Services</span>
              <Badge variant="warning">{warningServices}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Error Services</span>
              <Badge variant="danger">{errorServices}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">System Uptime</span>
              <Badge variant="success">{systemStats.systemUptime}%</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Recent System Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-green-400 mr-3" />
              <div>
                <p className="text-sm text-white">System Backup Completed</p>
                <p className="text-xs text-white/70">All services backed up successfully</p>
              </div>
            </div>
            <span className="text-xs text-white/70">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm text-white">High Memory Usage Alert</p>
                <p className="text-xs text-white/70">Memory usage exceeded 85% threshold</p>
              </div>
            </div>
            <span className="text-xs text-white/70">5 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center">
              <Settings className="w-4 h-4 text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-white">Configuration Updated</p>
                <p className="text-xs text-white/70">Transaction limits modified by admin</p>
              </div>
            </div>
            <span className="text-xs text-white/70">1 day ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-white">Report Generated</p>
                <p className="text-xs text-white/70">Monthly compliance report created</p>
              </div>
            </div>
            <span className="text-xs text-white/70">2 days ago</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default DashboardHome
