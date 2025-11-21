import { env } from '@controlizze/env'

export const stripeConfig = {
  publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  secretKey: env.STRIPE_SECRET_KEY,

  webhookSecret: env.STRIPE_WEBHOOK_SECRET_KEY,

  plans: {
    free: {
      priceId: '',
      quota: {
        organizations: 1,
        transactions: 50,
        categories: 10,
        members: 1,
      },
    },

    pro: {
      priceId: env.STRIPE_PRICE_PRO_MONTHLY,
      quota: {
        organizations: Infinity,
        transactions: Infinity,
        categories: Infinity,
        members: Infinity,
      },
    },
  } as const,
}
