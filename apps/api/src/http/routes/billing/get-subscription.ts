import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { stripe } from '@/services/stripe'
import { getOrganizationPlan } from '@/utils/get-organization-plan'

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
          summary: 'Get organization billing.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              subscription: z.object({
                plan: z.string(),
                status: z.string(),
                cancelAtPeriodEnd: z.boolean(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params

        const { organization } = await request.getUserMembership(slug)

        if (!organization) {
          throw new NotFoundError('Organization not found.')
        }

        const subscription = await stripe.subscriptions.retrieve(
          organization.stripeSubscriptionId!,
        )

        const plan = await getOrganizationPlan(organization.slug)

        return {
          subscription: {
            plan,
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        }
      },
    )
}
