"use client"

import { Search, Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TopHeader() {
  return (
    <header className="flex h-16 items-center justify-between bg-sidebar px-6">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground/50" />
        <input
          type="text"
          placeholder="Search transactions, accounts..."
          className="h-10 w-full rounded-lg bg-sidebar-foreground/10 pl-10 pr-4 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/50 focus:outline-none focus:ring-2 focus:ring-sidebar-foreground/30"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button className="relative rounded-lg p-2 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-chart-4" />
          <span className="sr-only">Notifications</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-sidebar-foreground">Eyob Habtie</p>
            <p className="text-xs font-semibold text-chart-4">PREMIUM CUSTOMER</p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-chart-4">
            <AvatarImage src="/avatar.jpg" alt="Eyob Habtie" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">EH</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
