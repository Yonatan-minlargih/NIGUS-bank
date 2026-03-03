const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003'

class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

const handleAPIResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`
    
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorData.error || errorMessage
    } catch {
      // If JSON parsing fails, use default error message
    }
    
    throw new APIError(errorMessage, response.status)
  }
  
  return response.json()
}

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('nigus_token') || localStorage.getItem('token') || ''}`,
})

export interface Transaction {
  id: number
  accountId: number
  amount: number
  type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER_OUT" | "TRANSFER_IN" | "deposit" | "withdrawal" | "transfer"
  currency: string
  description?: string
  createdAt: string
  formattedAmount?: string
  // Frontend computed fields
  label: string
  date: string
  time: string
  positive: boolean
  rawAmount: number
  dateObj: Date
}

export interface TransactionFilters {
  dateRange: string
  type: string
  amountRange: string
  accountId?: string
}

export interface DepositRequest {
  accountId: number
  amount: number
  description?: string
  currency?: string
}

export interface WithdrawRequest {
  accountId: number
  amount: number
  description?: string
  currency?: string
}

export interface TransferRequest {
  fromAccountId: number
  toAccountId: number
  amount: number
  description?: string
  currency?: string
}

export class TransactionAPI {
  static async getAllTransactions(): Promise<Transaction[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/history`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await handleAPIResponse(response)
      
      // Transform backend data to frontend format
      return data.map((tx: any) => this.transformTransaction(tx))
    } catch (error) {
      console.error('Error fetching transactions:', error)
      if (error instanceof APIError) {
        throw error
      }
      // Return mock data as fallback
      return this.getMockTransactions()
    }
  }

  static async getFilteredTransactions(filters: TransactionFilters): Promise<Transaction[]> {
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.accountId && filters.accountId !== 'all') {
        queryParams.append('accountId', filters.accountId)
      }

      const response = await fetch(`${API_BASE_URL}/transactions/history?${queryParams}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      const data = await handleAPIResponse(response)
      
      const transactions = data.map((tx: any) => this.transformTransaction(tx))
      
      // Apply client-side filtering for date range, type, and amount range
      return this.filterTransactionsClientSide(transactions, filters)
    } catch (error) {
      console.error('Error fetching filtered transactions:', error)
      if (error instanceof APIError) {
        throw error
      }
      // Fallback to client-side filtering with mock data
      const allTransactions = await this.getAllTransactions()
      return this.filterTransactionsClientSide(allTransactions, filters)
    }
  }

  private static filterTransactionsClientSide(transactions: Transaction[], filters: TransactionFilters): Transaction[] {
    let filtered = [...transactions]
    const now = new Date()

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const daysAgo = parseInt(filters.dateRange || '0')
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(tx => tx.dateObj >= cutoffDate)
    }

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(tx => tx.type === filters.type)
    }

    // Filter by amount range
    if (filters.amountRange !== 'all') {
      if (filters.amountRange === '0-100') {
        filtered = filtered.filter(tx => tx.rawAmount < 100)
      } else if (filters.amountRange === '100-1000') {
        filtered = filtered.filter(tx => tx.rawAmount >= 100 && tx.rawAmount <= 1000)
      } else if (filters.amountRange === '1000+') {
        filtered = filtered.filter(tx => tx.rawAmount > 1000)
      }
    }

    // Filter by account ID
    if (filters.accountId && filters.accountId !== 'all') {
      filtered = filtered.filter(tx => tx.accountId === parseInt(filters.accountId || '0'))
    }

    return filtered.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime())
  }

  private static transformTransaction(tx: any): Transaction {
    const createdAt = new Date(tx.createdAt)
    const amount = Number(tx.amount)
    const positive = amount >= 0
    
    return {
      id: tx.id,
      accountId: tx.accountId,
      amount: amount,
      type: tx.type.toLowerCase() as any,
      currency: tx.currency || 'ETB',
      description: tx.description,
      createdAt: tx.createdAt,
      formattedAmount: tx.formattedAmount,
      // Frontend computed fields
      label: tx.description || this.getTransactionLabel(tx.type),
      date: createdAt.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: createdAt.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      positive: positive,
      rawAmount: Math.abs(amount),
      dateObj: createdAt,
    }
  }

  private static getTransactionLabel(type: string): string {
    const labels: Record<string, string> = {
      'deposit': 'Deposit',
      'withdrawal': 'Withdrawal',
      'transfer_out': 'Transfer Out',
      'transfer_in': 'Transfer In',
      'transfer': 'Transfer',
      'DEPOSIT': 'Deposit',
      'WITHDRAWAL': 'Withdrawal',
      'TRANSFER_OUT': 'Transfer Out',
      'TRANSFER_IN': 'Transfer In',
    }
    return labels[type] || 'Transaction'
  }

  // Transaction operations
  static async deposit(request: DepositRequest): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/deposit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      })

      const data = await handleAPIResponse(response)
      return this.transformTransaction(data)
    } catch (error) {
      console.error('Error making deposit:', error)
      throw error
    }
  }

  static async withdraw(request: WithdrawRequest): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/withdraw`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      })

      const data = await handleAPIResponse(response)
      return this.transformTransaction(data)
    } catch (error) {
      console.error('Error making withdrawal:', error)
      throw error
    }
  }

  static async transfer(request: TransferRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/transfer`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      })

      await handleAPIResponse(response)
    } catch (error) {
      console.error('Error making transfer:', error)
      throw error
    }
  }

  private static getMockTransactions(): Transaction[] {
    return [
      {
        id: 1,
        accountId: 1,
        amount: 15000,
        type: "deposit",
        currency: "ETB",
        description: "Salary Deposit",
        createdAt: "2023-08-28T09:45:00",
        label: "Salary Deposit",
        date: "Aug 28, 2023",
        time: "09:45 AM",
        positive: true,
        rawAmount: 15000,
        dateObj: new Date("2023-08-28"),
      },
      {
        id: 2,
        accountId: 1,
        amount: -15,
        type: "withdrawal",
        currency: "ETB",
        description: "ATM Withdrawal",
        createdAt: "2023-08-27T13:20:00",
        label: "ATM Withdrawal",
        date: "Aug 27, 2023",
        time: "01:20 PM",
        positive: false,
        rawAmount: 15,
        dateObj: new Date("2023-08-27"),
      },
      {
        id: 3,
        accountId: 2,
        amount: -2450,
        type: "withdrawal",
        currency: "ETB",
        description: "Online Purchase",
        createdAt: "2023-08-26T15:10:00",
        label: "Online Purchase",
        date: "Aug 26, 2023",
        time: "03:10 PM",
        positive: false,
        rawAmount: 2450,
        dateObj: new Date("2023-08-26"),
      },
      {
        id: 4,
        accountId: 1,
        amount: 142.18,
        type: "deposit",
        currency: "ETB",
        description: "Interest Credit",
        createdAt: "2023-08-24T00:00:00",
        label: "Interest Credit",
        date: "Aug 24, 2023",
        time: "12:00 AM",
        positive: true,
        rawAmount: 142.18,
        dateObj: new Date("2023-08-24"),
      },
      {
        id: 5,
        accountId: 1,
        amount: -500,
        type: "transfer",
        currency: "ETB",
        description: "Transfer to John",
        createdAt: "2023-08-23T11:30:00",
        label: "Transfer to John",
        date: "Aug 23, 2023",
        time: "11:30 AM",
        positive: false,
        rawAmount: 500,
        dateObj: new Date("2023-08-23"),
      },
    ]
  }
}
