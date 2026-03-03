"use client"

import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  CreditCard,
  Settings,
  Headphones,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: false },
  { label: "Transactions", icon: ArrowLeftRight, active: false },
  { label: "Accounts", icon: Landmark, active: false },
  { label: "Cards", icon: CreditCard, active: true },
]

const bottomItems = [
  { label: "Settings", icon: Settings },
  { label: "Support", icon: Headphones },
]

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-56 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-6">
        <Landmark className="h-6 w-6 text-chart-4" />
        <span className="text-lg font-bold tracking-tight">
          <span className="text-chart-4">NIGUS</span> Bank
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="flex flex-col gap-1 px-3 pb-6">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  )
}
