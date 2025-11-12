export interface Category {
  id: string
  name: string
  slug: string
  color: string
  type: 'EXPENSE' | 'REVENUE'
  createdAt: string
  owner: {
    id: string
    name: string | null
    avatarUrl: string | null
  }
}
