import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminDashboardLayout from '../layouts/AdminDashboardLayout'
import DashboardHome from './DashboardHome'
import UserManagement from './UserManagement'
import AccountManagement from './AccountManagement'
import TransactionMonitoring from './TransactionMonitoring'
import CardManagement from './CardManagement'
import AuditLogs from './AuditLogs'

const AdminDashboard = () => {
  return (
    <AdminDashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/accounts" element={<AccountManagement />} />
        <Route path="/transactions" element={<TransactionMonitoring />} />
        <Route path="/cards" element={<CardManagement />} />
        <Route path="/audit" element={<AuditLogs />} />
      </Routes>
    </AdminDashboardLayout>
  )
}

export default AdminDashboard
