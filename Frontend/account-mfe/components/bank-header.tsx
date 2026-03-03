"use client"

import { Bell, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function BankHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search transactions, accounts..."
          className="h-10 w-full rounded-lg bg-muted pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button
          className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-bank-gold" />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">Eyob Habtie</p>
            <p className="text-xs font-medium tracking-wider text-bank-gold uppercase">
              Premium Customer
            </p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-bank-gold">
            <AvatarImage src="" alt="Eyob Habtie" />
            <AvatarFallback className="bg-bank-green text-primary-foreground text-xs font-bold">
              EH
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
