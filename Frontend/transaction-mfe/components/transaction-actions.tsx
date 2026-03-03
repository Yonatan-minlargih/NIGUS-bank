"use client"

import { useState } from "react"
import { ArrowDownUp, ArrowUp, ArrowRight, X, ChevronDown, AlertCircle } from "lucide-react"
import { TransactionAPI, DepositRequest, WithdrawRequest, TransferRequest } from "@/lib/api"

interface TransactionForm {
  accountNumber: string
  amount: string
  description: string
  transferTo?: string
}

type ActionType = "deposit" | "withdraw" | "transfer" | null

export function TransactionActions() {
  const [activeAction, setActiveAction] = useState<ActionType>(null)
  const [formData, setFormData] = useState<TransactionForm>({
    accountNumber: "",
    amount: "",
    description: "",
    transferTo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const accounts = [
    { id: "ACC001", number: "1000456789", type: "Savings", balance: "15,000.00 ETB" },
    { id: "ACC002", number: "1000123456", type: "Checking", balance: "2,450.00 ETB" },
    { id: "ACC003", number: "1000789012", type: "Business", balance: "50,000.00 ETB" },
  ]

  const resetForm = () => {
    setFormData({
      accountNumber: "",
      amount: "",
      description: "",
      transferTo: "",
    })
    setError(null)
    setSuccess(null)
  }

  const handleActionClick = (action: ActionType) => {
    if (activeAction === action) {
      setActiveAction(null)
      resetForm()
    } else {
      setActiveAction(action)
      resetForm()
    }
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const accountId = parseInt(formData.accountNumber)
      const amount = parseFloat(formData.amount)

      if (isNaN(accountId) || isNaN(amount) || amount <= 0) {
        throw new Error('Please enter valid account number and amount')
      }

      let result
      
      if (activeAction === 'deposit') {
        const depositRequest: DepositRequest = {
          accountId,
          amount,
          description: formData.description,
          currency: 'ETB'
        }
        result = await TransactionAPI.deposit(depositRequest)
        setSuccess('Deposit completed successfully!')
      } else if (activeAction === 'withdraw') {
        const withdrawRequest: WithdrawRequest = {
          accountId,
          amount,
          description: formData.description,
          currency: 'ETB'
        }
        result = await TransactionAPI.withdraw(withdrawRequest)
        setSuccess('Withdrawal completed successfully!')
      } else if (activeAction === 'transfer') {
        const toAccountId = parseInt(formData.transferTo || '')
        if (isNaN(toAccountId)) {
          throw new Error('Please enter a valid destination account number')
        }
        
        const transferRequest: TransferRequest = {
          fromAccountId: accountId,
          toAccountId: toAccountId,
          amount,
          description: formData.description,
          currency: 'ETB'
        }
        await TransactionAPI.transfer(transferRequest)
        setSuccess('Transfer completed successfully!')
      }

      // Reset form after successful submission
      setTimeout(() => {
        setActiveAction(null)
        resetForm()
      }, 2000)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const actionButtons = [
    {
      type: "deposit" as ActionType,
      label: "Deposit",
      icon: ArrowDownUp,
      color: "bg-[#4caf50]",
      hoverColor: "hover:bg-[#45a049]",
    },
    {
      type: "withdraw" as ActionType,
      label: "Withdraw",
      icon: ArrowUp,
      color: "bg-[#ff9800]",
      hoverColor: "hover:bg-[#fb8c00]",
    },
    {
      type: "transfer" as ActionType,
      label: "Transfer",
      icon: ArrowRight,
      color: "bg-[#2196f3]",
      hoverColor: "hover:bg-[#1976d2]",
    },
  ]

  return (
    <div className="mb-6">
      {/* Action Buttons */}
      <div className="flex gap-4">
        {actionButtons.map(({ type, label, icon: Icon, color, hoverColor }) => (
          <button
            key={type}
            onClick={() => handleActionClick(type)}
            className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-[#ffffff] transition-colors ${color} ${hoverColor} ${
              activeAction === type ? "ring-2 ring-[#ffffff]/50" : ""
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Expanded Form */}
      {activeAction && (
        <div className="mt-4 rounded-xl bg-[#5a9e6e] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#ffffff] capitalize">
              {activeAction} Transaction
            </h3>
            <button
              onClick={() => {
                setActiveAction(null)
                resetForm()
              }}
              className="text-[#ffffff]/60 hover:text-[#ffffff]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/20 p-3">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-4 rounded-lg bg-green-500/20 p-3">
                <p className="text-sm text-green-400">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#ffffff]/80">
                Select Account
              </label>
              <div className="relative">
                <select
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="h-11 w-full appearance-none rounded-lg border border-[#ffffff]/20 bg-[#ffffff]/10 px-4 pr-10 text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#ffffff]/30"
                  required
                >
                  <option value="" className="bg-black text-white">Choose an account...</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.number} className="bg-black text-white">
                      {account.number} - {account.type} (Balance: {account.balance})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ffffff]/60" />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#ffffff]/80">
                Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="h-11 w-full rounded-lg border border-[#ffffff]/20 bg-[#ffffff]/10 px-4 text-sm text-[#ffffff] placeholder-[#ffffff]/50 focus:outline-none focus:ring-2 focus:ring-[#ffffff]/30"
                  placeholder="0.00"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#ffffff]/60">
                  ETB
                </span>
              </div>
            </div>

            {/* Transfer To (only for transfer) */}
            {activeAction === "transfer" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#ffffff]/80">
                  Transfer To
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.transferTo}
                    onChange={(e) => setFormData({ ...formData, transferTo: e.target.value })}
                    className="h-11 w-full rounded-lg border border-[#ffffff]/20 bg-[#ffffff]/10 px-4 text-sm text-[#ffffff] placeholder-[#ffffff]/50 focus:outline-none focus:ring-2 focus:ring-[#ffffff]/30"
                    placeholder="Enter account number or recipient name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#ffffff]/80">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="h-20 w-full resize-none rounded-lg border border-[#ffffff]/20 bg-[#ffffff]/10 px-4 py-3 text-sm text-[#ffffff] placeholder-[#ffffff]/50 focus:outline-none focus:ring-2 focus:ring-[#ffffff]/30"
                placeholder={`Enter a description for this ${activeAction}...`}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 rounded-lg px-6 py-3 text-sm font-medium text-[#ffffff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeAction === "deposit"
                    ? "bg-[#4caf50] hover:bg-[#45a049]"
                    : activeAction === "withdraw"
                    ? "bg-[#ff9800] hover:bg-[#fb8c00]"
                    : "bg-[#2196f3] hover:bg-[#1976d2]"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    {activeAction === "deposit" && "Deposit Funds"}
                    {activeAction === "withdraw" && "Withdraw Funds"}
                    {activeAction === "transfer" && "Transfer Funds"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveAction(null)
                  resetForm()
                }}
                className="rounded-lg bg-[#ffffff]/15 px-6 py-3 text-sm font-medium text-[#ffffff] transition-colors hover:bg-[#ffffff]/25"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
