import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileText, 
  Settings, 
  HelpCircle,
  Shield,
  Server,
  AlertTriangle,
  Activity,
  FileCheck,
  LogOut
} from 'lucide-react'
import { useAuth } from '../../auth/authContext'

const adminMenuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'User Management', icon: Users },
  { path: '/admin/accounts', label: 'Account Management', icon: CreditCard },
  { path: '/admin/transactions', label: 'Transactions', icon: FileText },
  { path: '/admin/cards', label: 'Card Management', icon: CreditCard },
  { path: '/admin/audit', label: 'Audit Logs', icon: FileCheck },
]

const superAdminMenuItems = [
  { path: '/superadmin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/superadmin/admins', label: 'Admin Management', icon: Users },
  { path: '/superadmin/system', label: 'System Configuration', icon: Settings },
  { path: '/superadmin/risk', label: 'Risk & Fraud', icon: AlertTriangle },
  { path: '/superadmin/health', label: 'Service Health', icon: Activity },
  { path: '/superadmin/reports', label: 'Compliance Reports', icon: FileText },
]

const Sidebar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  
  const menuItems = user?.role === 'ADMIN' ? adminMenuItems : superAdminMenuItems

  // Mobile/tablet responsive: only below md, desktop is unchanged
  const [open, setOpen] = React.useState(false);
  return (
    <>
      {/* Hamburger for mobile only */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#2D8C5B] p-2 rounded-full text-white shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
        style={{display: 'block'}}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Overlay for mobile drawer */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" onClick={() => setOpen(false)}></div>
      )}
      {/* Sidebar Drawer (mobile/tablet) */}
      <div
        className={
          `
          fixed top-0 left-0 z-50 h-full w-64 bg-[#2D8C5B] min-h-screen flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:flex md:w-64
          `
        }
        style={{ boxShadow: open ? '0 0 20px rgba(0,0,0,0.2)' : undefined }}
      >
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-end p-2">
          <button onClick={() => setOpen(false)} aria-label="Close sidebar">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* 🔥 Updated Logo Section (Matches Screenshot) */}
        <div className="px-6 py-5 border-b border-green-700">
          <div className="flex items-center space-x-3">
            {/* Bank Icon */}
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 10L12 4l9 6" />
              <path d="M4 10h16v8H4z" />
              <path d="M9 10v8M15 10v8" />
            </svg>
            {/* Text */}
            <h1 className="text-xl font-bold">
              <span className="text-orange-400">NIGUS</span>
              <span className="text-white ml-1">Bank</span>
            </h1>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname.startsWith(item.path)
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#FFFFFF26] text-white'
                        : 'text-green-100 hover:bg-green-600 hover:text-white'
                    }`}
                    onClick={() => open && setOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
        {/* Bottom Actions */}
        <div className="p-4 border-t border-green-700">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-green-100 hover:bg-primary-600 hover:text-white rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar