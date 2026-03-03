"use client"

import { useState, useEffect, useMemo } from "react"
import { Transaction, TransactionFilters, TransactionAPI } from "@/lib/api"

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<TransactionFilters>({
    dateRange: "all",
    type: "all",
    amountRange: "all",
  })

  // Fetch all transactions on mount
  useEffect(() => {
    fetchTransactions()
  }, [])

  // Apply filters when they change
  useEffect(() => {
    applyFilters()
  }, [filters, transactions])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await TransactionAPI.getAllTransactions()
      setTransactions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = async () => {
    if (filters.dateRange === "all" && filters.type === "all" && filters.amountRange === "all") {
      // No filters applied, show all transactions
      setFilteredTransactions(transactions)
    } else {
      try {
        setLoading(true)
        const filtered = await TransactionAPI.getFilteredTransactions(filters)
        setFilteredTransactions(filtered)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to filter transactions")
        // Fallback to client-side filtering
        setFilteredTransactions(filterTransactionsClientSide(transactions, filters))
      } finally {
        setLoading(false)
      }
    }
  }

  const filterTransactionsClientSide = (txs: Transaction[], fltrs: TransactionFilters): Transaction[] => {
    let filtered = [...txs]
    const now = new Date()

    // Filter by date range
    if (fltrs.dateRange !== "all") {
      const daysAgo = parseInt(fltrs.dateRange || '0')
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(tx => tx.dateObj >= cutoffDate)
    }

    // Filter by type
    if (fltrs.type !== "all") {
      filtered = filtered.filter(tx => tx.type === fltrs.type)
    }

    // Filter by amount range
    if (fltrs.amountRange !== "all") {
      if (fltrs.amountRange === "0-100") {
        filtered = filtered.filter(tx => tx.rawAmount < 100)
      } else if (fltrs.amountRange === "100-1000") {
        filtered = filtered.filter(tx => tx.rawAmount >= 100 && tx.rawAmount <= 1000)
      } else if (fltrs.amountRange === "1000+") {
        filtered = filtered.filter(tx => tx.rawAmount > 1000)
      }
    }

    return filtered.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime())
  }

  const setFilters = (newFilters: Partial<TransactionFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFiltersState({
      dateRange: "all",
      type: "all",
      amountRange: "all",
    })
  }

  const refetch = () => {
    fetchTransactions()
  }

  return {
    transactions,
    filteredTransactions,
    loading,
    error,
    filters,
    setFilters,
    clearFilters,
    refetch,
    hasActiveFilters: filters.dateRange !== "all" || filters.type !== "all" || filters.amountRange !== "all",
  }
}
