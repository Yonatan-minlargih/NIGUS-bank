"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  CreditCard,
  Settings,
  HelpCircle,
  Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Transactions", icon: ArrowLeftRight, href: "/" },
  { label: "Accounts", icon: Landmark, href: "/" },
  { label: "Cards", icon: CreditCard, href: "/" },
]

const bottomItems = [
  { label: "Settings", icon: Settings, href: "/" },
  { label: "Support", icon: HelpCircle, href: "/" },
]

export function BankSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6">
        <Building2 className="h-6 w-6 text-bank-gold" />
        <span className="text-lg font-bold tracking-wide text-sidebar-foreground">
          NIGUS <span className="font-normal">Bank</span>
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
        {navItems.map((item) => {
          const isActive = item.label === "Accounts" && (pathname === "/" || pathname === "/create-account")
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="flex flex-col gap-1 px-3 pb-6">
        {bottomItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  )
}
