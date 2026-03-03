export const mockSystemConfig = [
  {
    id: 'SC001',
    key: 'DEFAULT_INTEREST_RATE',
    value: '4.5',
    description: 'Default annual interest rate for savings accounts',
    category: 'INTEREST',
    updated_by: 'John Smith',
    updated_at: '2024-01-14T10:30:00Z'
  },
  {
    id: 'SC002',
    key: 'DAILY_TRANSFER_LIMIT',
    value: '50000',
    description: 'Maximum daily transfer amount per user',
    category: 'TRANSACTION_LIMITS',
    updated_by: 'Sarah Johnson',
    updated_at: '2024-01-13T15:45:00Z'
  },
  {
    id: 'SC003',
    key: 'SINGLE_TRANSACTION_LIMIT',
    value: '10000',
    description: 'Maximum amount for single transaction',
    category: 'TRANSACTION_LIMITS',
    updated_by: 'Emily Davis',
    updated_at: '2024-01-12T09:20:00Z'
  },
  {
    id: 'SC004',
    key: 'DEFAULT_CURRENCY',
    value: 'ETB',
    description: 'Default currency for the system',
    category: 'CURRENCY',
    updated_by: 'Robert Wilson',
    updated_at: '2024-01-11T14:15:00Z'
  },
  {
    id: 'SC005',
    key: 'MAX_LOGIN_ATTEMPTS',
    value: '3',
    description: 'Maximum failed login attempts before account lock',
    category: 'SECURITY',
    updated_by: 'Michael Chen',
    updated_at: '2024-01-10T11:30:00Z'
  },
  {
    id: 'SC006',
    key: 'PASSWORD_EXPIRY_DAYS',
    value: '90',
    description: 'Number of days before password expires',
    category: 'SECURITY',
    updated_by: 'John Smith',
    updated_at: '2024-01-09T16:45:00Z'
  },
  {
    id: 'SC007',
    key: 'MIN_BALANCE_SAVINGS',
    value: '100',
    description: 'Minimum balance required for savings accounts',
    category: 'ACCOUNT',
    updated_by: 'Sarah Johnson',
    updated_at: '2024-01-08T13:20:00Z'
  },
  {
    id: 'SC008',
    key: 'OVERDRAFT_LIMIT',
    value: '5000',
    description: 'Maximum overdraft amount allowed',
    category: 'ACCOUNT',
    updated_by: 'Emily Davis',
    updated_at: '2024-01-07T10:15:00Z'
  }
]
