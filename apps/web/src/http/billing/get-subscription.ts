import { api } from '../api-client'

interface GetSubscriptionResponse {
  subscription: {
    name: string
    quota: {
      organizations: {
        available: number
        current: number
        usage: number
      }
      transactions: {
        available: number
        current: number
        usage: number
      }
      categories: {
        available: number
        current: number
        usage: number
      }
      members: {
        available: number
        current: number
        usage: number
      }
    }
  }
}

export async function getSubscription(
  organization: string,
): Promise<GetSubscriptionResponse> {
  const response = await api
    .get(`organizations/${organization}/subscription`)
    .json<GetSubscriptionResponse>()

  return response
}
