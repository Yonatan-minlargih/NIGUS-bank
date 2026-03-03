"use client"

import { ChevronDown } from "lucide-react"
import { useTransactions } from "@/hooks/use-transactions"

export function TransactionFilters() {
  const { filters, setFilters, clearFilters, loading } = useTransactions()

  return (
    <div className="rounded-xl bg-[#5a9e6e] p-6">
      <div className="flex flex-wrap items-end gap-4">
        {/* Date Range */}
        <div className="flex-1 min-w-45">
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#ffffff]/80">
            Date Range
          </label>
          <div className="relative">
            <select 
              value={filters.dateRange}
              onChange={(e) => setFilters({ dateRange: e.target.value })}
              disabled={loading}
              className="h-11 w-full appearance-none rounded-lg border border-[#ffffff]/20 bg-[#ffffff]/10 px-4 pr-10 text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#ffffff]/30 disabled:opacity-50"
            >
              <option value="all" className="bg-black text-white">All Time</option>
              <option value="7" className="bg-black text-white">Last 7 Days</option>
              <option value="30" className="bg-black text-white">Last 30 Days</option>
              <option value="90" className="bg-black text-white">Last 90 Days</option>
              <option value="365" className="bg-black text-white">This Year</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ffffff]/60" />
          </div>
        </div>

        {/* Transaction Type */}
        <div className="flex-1 min-w-45">
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#ffffff]/80">
            Transaction Type
          </label>
          <div className="relative">
            <select 
              value={filters.type}
              onChange={(e) => setFilters({ type: e.target.value })}
              disabled={loading}
              className="h-11 w-full appearance-none rounded-lg border border-[#ffffff]/20 bg-[#ffffff]/10 px-4 pr-10 text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#ffffff]/30 disabled:opacity-50"
            >
              <option value="all" className="bg-black text-white">All Types</option>
              <option value="deposit" className="bg-black text-white">Deposit</option>
              <option value="withdrawal" className="bg-black text-white">Withdrawal</option>
              <option value="transfer_in" className="bg-black text-white">Transfer In</option>
              <option value="transfer_out" className="bg-black text-white">Transfer Out</option>
              <option value="transfer" className="bg-black text-white">Transfer</option>
              <option value="interest" className="bg-black text-white">Interest Credit</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ffffff]/60" />
          </div>
        </div>

        {/* Amount */}
        <div className="flex-1 min-w-45">
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#ffffff]/80">
            Amount
          </label>
          <div className="relative">
            <select 
              value={filters.amountRange}
              onChange={(e) => setFilters({ amountRange: e.target.value })}
              disabled={loading}
              className="h-11 w-full appearance-none rounded-lg border border-[#ffffff]/20 bg-[#ffffff]/10 px-4 pr-10 text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#ffffff]/30 disabled:opacity-50"
            >
              <option value="all" className="bg-black text-white">Any Amount</option>
              <option value="0-100" className="bg-black text-white">Under 100 ETB</option>
              <option value="100-1000" className="bg-black text-white">100 - 1,000 ETB</option>
              <option value="1000+" className="bg-black text-white">Over 1,000 ETB</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ffffff]/60" />
          </div>
        </div>

        {/* Clear Filters */}
        <button 
          onClick={clearFilters}
          disabled={loading}
          className="h-11 rounded-lg bg-[#ffffff]/15 px-6 text-sm font-medium text-[#ffffff] transition-colors hover:bg-[#ffffff]/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
