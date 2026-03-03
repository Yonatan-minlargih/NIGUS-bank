"use client"

import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  CreditCard,
  Settings,
  Headphones,
  Building2,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: false },
  { label: "Transactions", icon: ArrowLeftRight, active: true },
  { label: "Accounts", icon: Wallet, active: false },
  { label: "Cards", icon: CreditCard, active: false },
]

const bottomItems = [
  { label: "Settings", icon: Settings },
  { label: "Support", icon: Headphones },
]

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-55 flex-col bg-[#2e5a2e]">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-6">
        <Building2 className="h-6 w-6 text-[#f9a825]" />
        <span className="text-lg font-bold tracking-wide">
          <span className="text-[#f9a825]">NIGUS</span>{" "}
          <span className="text-[#ffffff]">Bank</span>
        </span>
      </div>

      {/* Nav Items */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              item.active
                ? "bg-[#4a8c4a] text-[#ffffff]"
                : "text-[#c8e6c9] hover:bg-[#3d6e3d] hover:text-[#ffffff]"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="flex flex-col gap-1 px-3 pb-6">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#c8e6c9] transition-colors hover:bg-[#3d6e3d] hover:text-[#ffffff]"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  )
}
