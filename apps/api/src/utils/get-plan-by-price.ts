import { stripeConfig } from '@/services/stripe/config'

type Plan = {
  priceId: string | null
  quota: {
    organizations: number
    transactions: number
    categories: number
    members: number
  }
}

type Plans = {
  [key: string]: Plan
}

export function getPlanByPrice(priceId: string) {
  const plans: Plans = stripeConfig.plans

  const planKey = Object.keys(plans).find(
    (key) => plans[key].priceId === priceId,
  ) as keyof Plans | undefined

  const plan = planKey ? plans[planKey] : null

  if (!plan) {
    throw new Error(`Plan not found for priceId.`)
  }

  return {
    name: String(planKey),
    quota: plan.quota,
  }
}
