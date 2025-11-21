import z from 'zod'

// Schema para quotas limitadas
const limitedQuotaSchema = z.object({
  available: z.number(),
  current: z.number(),
  usage: z.number(),
})

const limitedSubscriptionSchema = z.object({
  name: z.string(),
  quota: z.object({
    organizations: limitedQuotaSchema,
    transactions: limitedQuotaSchema,
    categories: limitedQuotaSchema,
    members: limitedQuotaSchema,
  }),
})

// Schema para quotas ilimitadas
const unlimitedQuotaSchema = z.object({
  organizations: z.literal('unlimited'),
  transactions: z.literal('unlimited'),
  categories: z.literal('unlimited'),
  members: z.literal('unlimited'),
})

const unlimitedSubscriptionSchema = z.object({
  name: z.string(),
  quota: unlimitedQuotaSchema,
})

// Union dos dois tipos de subscription
const subscriptionSchema = z.union([
  limitedSubscriptionSchema,
  unlimitedSubscriptionSchema,
])

export const subscriptionResponseSchema = z.object({
  subscription: subscriptionSchema,
})
