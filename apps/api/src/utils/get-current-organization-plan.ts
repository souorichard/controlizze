import { NotFoundError } from '@/http/routes/_errors/not-found-error'
import { prisma } from '@/lib/prisma'

import { getPlanByPrice } from './get-plan-by-price'

export async function getCurrentOrganizationPlan(slug: string) {
  const organization = await prisma.organization.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      stripePriceId: true,
      ownerId: true,
    },
  })

  if (!organization) {
    throw new NotFoundError('Organization not found.')
  }

  const plan = getPlanByPrice(organization.stripePriceId ?? '')

  const [organizationsCount, transactionsCount, categoriesCount, membersCount] =
    await Promise.all([
      prisma.organization.count({
        where: {
          ownerId: organization.ownerId,
        },
      }),

      prisma.transaction.count({
        where: {
          organizationId: organization.id,
        },
      }),

      prisma.category.count({
        where: {
          organizationId: organization.id,
        },
      }),

      prisma.member.count({
        where: {
          organizationId: organization.id,
        },
      }),
    ])

  const availableOrganizations = plan.quota.organizations
  const currentOrganizations = organizationsCount
  const usageOrganizations =
    (currentOrganizations / availableOrganizations) * 100

  const availableTransactions = plan.quota.transactions
  const currentTransactions = transactionsCount
  const usageTransactions = (currentTransactions / availableTransactions) * 100

  const availableCategories = plan.quota.categories
  const currentCategories = categoriesCount
  const usageCategories = (currentCategories / availableCategories) * 100

  const availableMembers = plan.quota.members
  const currentMembers = membersCount
  const usageMembers = (currentMembers / availableMembers) * 100

  return {
    subscription: {
      name: plan.name,
      quota: {
        organizations: {
          available: availableOrganizations,
          current: currentOrganizations,
          usage: usageOrganizations,
        },
        transactions: {
          available: availableTransactions,
          current: currentTransactions,
          usage: usageTransactions,
        },
        categories: {
          available: availableCategories,
          current: currentCategories,
          usage: usageCategories,
        },
        members: {
          available: availableMembers,
          current: currentMembers,
          usage: usageMembers,
        },
      },
    },
  }
}
