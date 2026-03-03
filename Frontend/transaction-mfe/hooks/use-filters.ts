"use client"

import { useState, useMemo } from "react"

interface Transaction {
  id: number
  type: "deposit" | "withdrawal" | "interest" | "transfer"
  label: string
  date: string
  time: string
  amount: string
  positive: boolean
  rawAmount: number
  dateObj: Date
}

interface Filters {
  dateRange: string
  type: string
  amountRange: string
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: "deposit",
    label: "Salary Deposit",
    date: "Aug 28, 2023",
    time: "09:45 AM",
    amount: "+15,000.00 ETB",
    positive: true,
    rawAmount: 15000,
    dateObj: new Date("2023-08-28"),
  },
  {
    id: 2,
    type: "withdrawal",
    label: "ATM Withdrawal",
    date: "Aug 27, 2023",
    time: "01:20 PM",
    amount: "-15.00 ETB",
    positive: false,
    rawAmount: 15,
    dateObj: new Date("2023-08-27"),
  },
  {
    id: 3,
    type: "withdrawal",
    label: "Online Purchase",
    date: "Aug 26, 2023",
    time: "03:10 PM",
    amount: "-2,450.00 ETB",
    positive: false,
    rawAmount: 2450,
    dateObj: new Date("2023-08-26"),
  },
  {
    id: 4,
    type: "interest",
    label: "Interest Credit",
    date: "Aug 24, 2023",
    time: "12:00 AM",
    amount: "+142.18 ETB",
    positive: true,
    rawAmount: 142.18,
    dateObj: new Date("2023-08-24"),
  },
  {
    id: 5,
    type: "transfer",
    label: "Transfer to John",
    date: "Aug 23, 2023",
    time: "11:30 AM",
    amount: "-500.00 ETB",
    positive: false,
    rawAmount: 500,
    dateObj: new Date("2023-08-23"),
  },
  {
    id: 6,
    type: "deposit",
    label: "Freelance Payment",
    date: "Aug 22, 2023",
    time: "02:15 PM",
    amount: "+3,200.00 ETB",
    positive: true,
    rawAmount: 3200,
    dateObj: new Date("2023-08-22"),
  },
  {
    id: 7,
    type: "withdrawal",
    label: "Restaurant Bill",
    date: "Aug 21, 2023",
    time: "07:45 PM",
    amount: "-85.50 ETB",
    positive: false,
    rawAmount: 85.5,
    dateObj: new Date("2023-08-21"),
  },
  {
    id: 8,
    type: "interest",
    label: "Quarterly Interest",
    date: "Aug 20, 2023",
    time: "09:00 AM",
    amount: "+325.00 ETB",
    positive: true,
    rawAmount: 325,
    dateObj: new Date("2023-08-20"),
  },
]

export function useFilters() {
  const [filters, setFiltersState] = useState<Filters>({
    dateRange: "30",
    type: "all",
    amountRange: "all",
  })

  const setFilters = (newFilters: Partial<Filters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFiltersState({
      dateRange: "30",
      type: "all",
      amountRange: "all",
    })
  }

  const filteredTransactions = useMemo(() => {
    let filtered = [...mockTransactions]
    const now = new Date()

    // Filter by date range
    if (filters.dateRange !== "all") {
      const daysAgo = parseInt(filters.dateRange)
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(tx => tx.dateObj >= cutoffDate)
    }

    // Filter by type
    if (filters.type !== "all") {
      filtered = filtered.filter(tx => tx.type === filters.type)
    }

    // Filter by amount range
    if (filters.amountRange !== "all") {
      if (filters.amountRange === "0-100") {
        filtered = filtered.filter(tx => tx.rawAmount < 100)
      } else if (filters.amountRange === "100-1000") {
        filtered = filtered.filter(tx => tx.rawAmount >= 100 && tx.rawAmount <= 1000)
      } else if (filters.amountRange === "1000+") {
        filtered = filtered.filter(tx => tx.rawAmount > 1000)
      }
    }

    return filtered.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime())
  }, [filters])

  return {
    filters,
    setFilters,
    clearFilters,
    filteredTransactions,
    allTransactions: mockTransactions,
  }
}
