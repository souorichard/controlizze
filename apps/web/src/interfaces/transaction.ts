export interface Transaction {
  id: string
  description: string
  type: 'EXPENSE' | 'REVENUE'
  category: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  amount: number
  owner: {
    id: string
    name: string | null
    avatarUrl: string | null
  }
  createdAt: string
}
