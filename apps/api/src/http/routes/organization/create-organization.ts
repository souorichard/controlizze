import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/services/stripe'
import { createSlug } from '@/utils/create-slug'
import { getCurrentOrganizationPlan } from '@/utils/get-current-organization-plan'

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
          body: z
            .object({
              name: z.string(),
              domain: z
                .string()
                .nullish()
                .transform((val) => (val === '' ? null : val)),
              shouldAttachUsersByDomain: z.boolean().default(false),
            })
            .refine(
              (data) => {
                if (data.shouldAttachUsersByDomain) {
                  return !!data.domain
                }

                return true
              },
              {
                message: 'Domain is required when auto-join is enabled.',
                path: ['domain'],
              },
            ),
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

        const existingOrganization = await prisma.organization.findFirst({
          where: {
            ownerId: userId,
          },
        })

        console.log({ existingOrganization })

        if (existingOrganization) {
          const { subscription } = await getCurrentOrganizationPlan(
            existingOrganization.slug,
          )

          if (subscription.name === 'free') {
            throw new BadRequestError(
              'You already have an organization on the FREE plan. Please upgrade your plan to create more organizations.',
            )
          }
        }

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

        await prisma.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            stripeCustomerId: customer.id,
          },
        })

        return reply.status(201).send({
          organizationId: organization.id,
        })
      },
    )
}
