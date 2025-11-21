export type Plan = {
  priceId: string | null
  quota: {
    organizations: number
    transactions: number
    categories: number
    members: number
  }
}

export type Plans = {
  [key: string]: Plan
}
