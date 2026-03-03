"use client"

import { Search, Bell } from "lucide-react"

export function TopBar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[#e0e0e0] bg-[#ffffff] px-8">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9e9e9e]" />
        <input
          type="text"
          placeholder="Search transactions, accounts..."
          className="h-10 w-full rounded-full bg-[#f5f5f5] pl-10 pr-4 text-sm text-[#333333] placeholder:text-[#9e9e9e] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/30"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button className="relative text-[#616161] hover:text-[#333333]">
          <Bell className="h-5 w-5" />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-[#e0e0e0]" />

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-[#333333]">Eyob Habtie</p>
            <p className="text-xs font-bold uppercase tracking-wider text-[#f9a825]">
              Premium Customer
            </p>
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#f9a825]">
            <div className="flex h-full w-full items-center justify-center bg-[#ff7043] text-xs font-bold text-[#ffffff]">
              EH
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
