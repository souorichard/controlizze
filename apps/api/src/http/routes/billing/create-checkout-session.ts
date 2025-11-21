import { env } from '@controlizze/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { stripe } from '@/services/stripe'
import { stripeConfig } from '@/services/stripe/config'

import { BadRequestError } from '../_errors/bad-request-error'
import { NotFoundError } from '../_errors/not-found-error'

export async function createCheckoutSession(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/subscription/checkout-session',
      {
        schema: {
          tags: ['Billing'],
          summary: 'Create checkout session',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              session: z.object({
                url: z.url().nullable(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params

        const { organization } = await request.getUserMembership(slug)

        if (!organization) {
          throw new NotFoundError('Organization not found')
        }

        try {
          const { url } = await stripe.checkout.sessions.create({
            customer: organization.stripeCustomerId as string,
            client_reference_id: organization.id,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
              {
                price: stripeConfig.plans.pro.priceId,
                quantity: 1,
              },
            ],
            success_url: `${env.NEXT_PUBLIC_WEB_URL}/payment-confirmation`,
            cancel_url: `${env.NEXT_PUBLIC_WEB_URL}/payment-cancelled`,
          })

          return {
            session: {
              url,
            },
          }
        } catch (error) {
          throw new BadRequestError('Could not create checkout session')
        }
      },
    )
}
