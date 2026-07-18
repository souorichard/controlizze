export interface Category {
  id: string
  name: string
  slug: string
  color: string
  owner: {
    id: string
    name: string | null
    avatarUrl: string | null
  }
  createdAt: string
}

export interface CategoriesFilter {
  page?: string
  perPage?: string
  name?: string
}

export interface HttpCategoriesFilter {
  page?: number
  perPage?: number
  name?: string
}
