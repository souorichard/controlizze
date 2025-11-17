import { NotFoundError } from '@/http/routes/_errors/not-found-error'
import { prisma } from '@/lib/prisma'
import { stripeConfig } from '@/services/stripe/config'

export async function getOrganizationPlan(slug: string) {
  const organization = await prisma.organization.findUnique({
    select: {
      stripePriceId: true,
    },
    where: {
      slug,
    },
  })

  if (!organization) {
    throw new NotFoundError('Organization not found')
  }

  const plan =
    organization.stripePriceId === stripeConfig.plans.free.priceId
      ? 'free'
      : 'pro'

  return plan
}
