import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { subscriptionResponseSchema } from '@/schemas/subscription-response-schema'
import { getCurrentOrganizationPlan } from '@/services/stripe'

import { NotFoundError } from '../_errors/not-found-error'

export async function getSubscription(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/subscription',
      {
        schema: {
          tags: ['Billing'],
          summary: 'Get organization billing',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: subscriptionResponseSchema,
          },
        },
      },
      async (request) => {
        const { slug } = request.params

        const { organization } = await request.getUserMembership(slug)

        if (!organization) {
          throw new NotFoundError('Organization not found')
        }

        const { subscription } = await getCurrentOrganizationPlan(
          organization.slug,
        )

        return {
          subscription,
        }
      },
    )
}
