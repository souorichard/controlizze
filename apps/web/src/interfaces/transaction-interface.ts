export interface Transaction {
  id: string
  title: string
  description: string
  type: 'EXPENSE' | 'INCOME'
  category: {
    id: string
    name: string
    color: string
  }
  amount: number
  status: 'PENDING' | 'PAID' | 'CANCELED'
  transactionDate: string
  owner: {
    id: string
    name: string | null
    avatarUrl: string | null
  }
  createdAt: string
}

export interface TransactionsFilter {
  page?: string
  perPage?: string
  title?: string
  type?: string
  status?: string
  // category?: string
  startDate?: string
  endDate?: string
}
