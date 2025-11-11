export interface Category {
  id: string
  name: string
  slug: string
  color: string
  type: 'EXPENSE' | 'REVENUE'
  owner: {
    id: string
    name: string | null
    avatarUrl: string | null
  }
  createdAt: string
}
