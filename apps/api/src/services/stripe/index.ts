import dayjs from 'dayjs'
import { Stripe } from 'stripe'

import { NotFoundError } from '@/http/routes/_errors/not-found-error'
import { Plans } from '@/interfaces/plan'
import { prisma } from '@/lib/prisma'

import { stripeConfig } from './config'

export const stripe = new Stripe(stripeConfig.secretKey)

export async function getStripeCustomerById(customerId: string) {
  const customer = await stripe.customers.retrieve(customerId)

  if (!customer) {
    throw new NotFoundError('Stripe customer not found')
  }

  return customer
}

interface CreateCustomerProps {
  name: string
  email?: string
  organizationId: string
}

export async function createStripeCustomer({
  name,
  email,
  organizationId,
}: CreateCustomerProps) {
  const customer = await stripe.customers.create({
    name,
    email,
    metadata: {
      organizationId,
    },
  })

  return customer
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
    throw new NotFoundError('Organization not found')
  }

  const plan = getPlanByPrice(organization.stripePriceId ?? '')

  const startOfMonth = dayjs().startOf('month').toDate()
  const endOfMonth = dayjs().endOf('month').toDate()

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
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
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
