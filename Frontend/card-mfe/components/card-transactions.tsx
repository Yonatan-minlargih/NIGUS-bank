"use client"

import { SlidersHorizontal } from "lucide-react"

const transactions = [
  {
    id: 1,
    title: "ATM Machine",
    date: "Aug 30, 2023",
    time: "02:45 PM",
    amount: "-1,299.00 ETB",
    category: "ELECTRONIC",
    iconText: "ATM",
  },
  {
    id: 2,
    title: "ATM Machine",
    date: "Aug 29, 2023",
    time: "08:20 PM",
    amount: "-450.00 ETB",
    category: "DINING",
    iconText: "ATM",
  },
  {
    id: 3,
    title: "Portable Card Reader",
    date: "Aug 29, 2023",
    time: "09:12 AM",
    amount: "-85.50 ETB",
    category: "TRANSPORT",
    iconText: "POS",
  },
  {
    id: 4,
    title: "ATM Machine",
    date: "Aug 28, 2023",
    time: "11:30 PM",
    amount: "-2,400.00 ETB",
    category: "ONLINE",
    iconText: "ATM",
  },
]

function TransactionIcon({ text }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-foreground/15 text-[10px] font-bold text-accent-foreground">
      {text}
    </div>
  )
}

function TransactionRow({ tx }) {
  return (
    <div className="flex items-center gap-4 border-t border-accent-foreground/10 px-5 py-4">
      <TransactionIcon text={tx.iconText} />
      <div className="flex-1">
        <p className="text-sm font-semibold text-accent-foreground">{tx.title}</p>
        <p className="text-xs text-accent-foreground/60">
          {tx.date} &bull; {tx.time}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-accent-foreground">{tx.amount}</p>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-foreground/60">
          {tx.category}
        </p>
      </div>
    </div>
  )
}

export function CardTransactions() {
  return (
    <div className="overflow-hidden rounded-2xl bg-accent shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-lg font-bold text-accent-foreground">Card Transactions</h2>
        <button className="flex items-center gap-1.5 text-sm text-accent-foreground/70 transition-colors hover:text-accent-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Transaction List */}
      <div>
        {transactions.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-accent-foreground/10 px-5 py-4 text-center">
        <button className="text-sm font-semibold text-accent-foreground transition-colors hover:text-accent-foreground/80">
          View All Transaction History
        </button>
      </div>
    </div>
  )
}
