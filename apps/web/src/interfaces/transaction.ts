export interface Transaction {
  id: string
  title: string
  description: string
  type: Type
  category: {
    id: string
    name: string
    color: string
  }
  amount: number
  status: Status
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
  type?: Type
  status?: Status
  category?: string
  startDate?: string
  endDate?: string
}

export interface HttpTransactionsFilter {
  page?: number
  perPage?: number
  title?: string
  type?: HttpType
  status?: HttpStatus
  categorySlug?: string
  startDate?: string
  endDate?: string
}
