import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/services/stripe'
import { stripeConfig } from '@/services/stripe/config'
import { createSlug } from '@/utils/create-slug'

import { BadRequestError } from '../_errors/bad-request-error'
import { ConflictError } from '../_errors/conflict-error'

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          tags: ['Organization'],
          summary: 'Create a new organization.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              organizationId: z.uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { name, domain, shouldAttachUsersByDomain } = request.body

        if (domain) {
          const organizationWithSameDomain =
            await prisma.organization.findUnique({
              where: {
                domain,
              },
            })

          if (organizationWithSameDomain) {
            throw new ConflictError(
              'Organization with same domain already exists.',
            )
          }
        }

        const existingFreeOrganization = await prisma.organization.findFirst({
          where: {
            stripePriceId: stripeConfig.plans.free.priceId,
            ownerId: userId,
          },
        })

        if (existingFreeOrganization) {
          throw new BadRequestError('You already have a free organization.')
        }

        const organization = await prisma.organization.create({
          data: {
            name,
            slug: createSlug(name),
            domain,
            shouldAttachUsersByDomain,
            ownerId: userId,
            members: {
              create: {
                userId,
                role: 'ADMIN',
              },
            },
          },
        })

        const customer = await stripe.customers.create({
          name,
          metadata: {
            org_id: organization.id,
          },
        })

        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{ price: stripeConfig.plans.free.priceId }],
        })

        await prisma.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            stripeCustomerId: customer.id,
            stripeSubscriptionId: subscription.id,
            stripeSubscriptionStatus: subscription.status,
            stripePriceId: subscription.items.data[0].price.id,
          },
        })

        return reply.status(201).send({
          organizationId: organization.id,
        })
      },
    )
}
