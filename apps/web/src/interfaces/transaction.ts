export interface Transaction {
  id: string
  description: string
  category: string
  type: 'EXPENSE' | 'REVENUE'
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  amount: number
  owner: {
    id: string
    name: string | null
    avatarUrl: string | null
  }
  createdAt: string
}
