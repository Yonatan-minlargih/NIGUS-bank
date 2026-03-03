import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SuperAdminDashboardLayout from '../layouts/SuperAdminDashboardLayout'
import DashboardHome from './DashboardHome'
import AdminManagement from './AdminManagement'
import SystemConfiguration from './SystemConfiguration'
import RiskFraudMonitoring from './RiskFraudMonitoring'
import ServiceHealthMonitoring from './ServiceHealthMonitoring'
import ComplianceReports from './ComplianceReports'

const SuperAdminDashboard = () => {
  return (
    <SuperAdminDashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/admins" element={<AdminManagement />} />
        <Route path="/system" element={<SystemConfiguration />} />
        <Route path="/risk" element={<RiskFraudMonitoring />} />
        <Route path="/health" element={<ServiceHealthMonitoring />} />
        <Route path="/reports" element={<ComplianceReports />} />
      </Routes>
    </SuperAdminDashboardLayout>
  )
}

export default SuperAdminDashboard
