"use client"

import { useState, useEffect } from "react"
import { SlidersHorizontal, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { useTransactions } from "@/hooks/use-transactions"

function TransactionIcon({ type }: { type: string }) {
  const normalizedType = type.toLowerCase()
  
  if (normalizedType === "deposit" || normalizedType === "transfer_in" || normalizedType === "interest") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#ffffff]/30 bg-[#ffffff]/10">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-[#ffffff]"
        >
          <rect
            x="3"
            y="3"
            width="14"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7 10h6M10 7v6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    )
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#ffffff]/30 bg-[#ffffff]/10">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="text-[#ffffff]"
      >
        <rect
          x="3"
          y="3"
          width="14"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M7 10h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function TransactionList() {
  const { 
    filteredTransactions, 
    transactions, 
    loading, 
    error, 
    hasActiveFilters,
    refetch 
  } = useTransactions()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredTransactions])

  if (error) {
    return (
      <div className="overflow-hidden rounded-xl bg-[#5a9e6e]">
        <div className="flex flex-col items-center justify-center px-6 py-12">
          <p className="text-sm text-[#ef9a9a] mb-4">Error loading transactions: {error}</p>
          <button 
            onClick={refetch}
            className="flex items-center gap-2 rounded-lg bg-[#ffffff]/15 px-4 py-2 text-sm text-[#ffffff] hover:bg-[#ffffff]/25"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl bg-[#5a9e6e]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h3 className="text-sm font-semibold text-[#ffffff]">
          {loading ? (
            "Loading..."
          ) : hasActiveFilters ? (
            `Filtered Transactions (${filteredTransactions.length})`
          ) : (
            "All Transactions"
          )}
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-[#ffffff]/70 hover:text-[#ffffff] disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 text-sm text-[#ffffff]/70 hover:text-[#ffffff]">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Transaction Items */}
      <div className="flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center px-6 py-12">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-[#ffffff]/60" />
              <p className="text-sm text-[#ffffff]/60">Loading transactions...</p>
            </div>
          </div>
        ) : currentTransactions.length === 0 ? (
          <div className="flex items-center justify-center px-6 py-12">
            <p className="text-sm text-[#ffffff]/60">
              {hasActiveFilters 
                ? "No transactions found matching your filters." 
                : "No transactions available."}
            </p>
          </div>
        ) : (
          currentTransactions.map((tx, index) => (
            <div
              key={tx.id}
              className={`flex items-center justify-between px-6 py-4 ${
                index < currentTransactions.length - 1 ? "border-b border-[#ffffff]/10" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <TransactionIcon type={tx.type} />
                <div>
                  <p className="text-sm font-bold text-[#ffffff]">{tx.label}</p>
                  <p className="text-xs text-[#ffffff]/60">
                    {tx.date} &bull; {tx.time}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-bold ${
                  tx.positive ? "text-[#a5d6a7]" : "text-[#ef9a9a]"
                }`}
              >
                {tx.positive ? '+' : '-'}{tx.rawAmount.toLocaleString()} ETB
              </span>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && currentTransactions.length > 0 && (
        <div className="flex items-center justify-between border-t border-[#ffffff]/10 px-6 py-4">
          <p className="text-xs text-[#ffffff]/50">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </p>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#ffffff]/50 hover:bg-[#ffffff]/10 hover:text-[#ffffff] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 3) {
                pageNum = i + 1
              } else if (currentPage === 1) {
                pageNum = i + 1
              } else if (currentPage === totalPages) {
                pageNum = totalPages - 2 + i
              } else {
                pageNum = currentPage - 1 + i
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium ${
                    pageNum === currentPage
                      ? "bg-[#4caf50] text-[#ffffff]"
                      : "text-[#ffffff]/70 hover:bg-[#ffffff]/10 hover:text-[#ffffff]"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            
            <button 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#ffffff]/50 hover:bg-[#ffffff]/10 hover:text-[#ffffff] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
