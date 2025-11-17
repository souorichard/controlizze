import { NotFoundError } from '@/http/routes/_errors/not-found-error'
import { prisma } from '@/lib/prisma'

export async function getOrganizationPlan(slug: string) {
  const organization = await prisma.organization.findUnique({
    select: {
      plan: true,
    },
    where: {
      slug,
    },
  })

  if (!organization) {
    throw new NotFoundError('Organization not found')
  }

  const plan = organization.plan

  return plan
}
