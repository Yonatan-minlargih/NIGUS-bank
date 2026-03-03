import { Download } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { TransactionActions } from "@/components/transaction-actions"
import { TransactionFilters } from "@/components/transaction-filters"
import { TransactionList } from "@/components/transaction-list"

export default function TransactionsPage() {
  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-55 flex flex-1 flex-col">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#1a1a2e]">
              Transactions History
            </h1>
            <button className="flex items-center gap-2 rounded-full bg-[#2e7d32] px-6 py-2.5 text-sm font-medium text-[#ffffff] transition-colors hover:bg-[#256e2a]">
              <Download className="h-4 w-4" />
              Export History
            </button>
          </div>

          {/* Transaction Actions */}
          <TransactionActions />

          {/* Filters */}
          <div className="mb-6">
            <TransactionFilters />
          </div>

          {/* Transaction List */}
          <TransactionList />
        </main>
      </div>
    </div>
  )
}
