import { env } from '@controlizze/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { stripe } from '@/services/stripe'
import { stripeConfig } from '@/services/stripe/config'

import { NotFoundError } from '../_errors/not-found-error'

export async function getSubscription(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/subscription/checkout-session',
      {
        schema: {
          tags: ['Billing'],
          summary: 'Create checkout session.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              session: z.object({
                id: z.string(),
                clientSecret: z.string().nullable(),
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

        try {
          const { id, client_secret: clientSecret } =
            await stripe.checkout.sessions.create({
              customer: organization.stripeCustomerId!,
              ui_mode: 'embedded',
              mode: 'subscription',
              payment_method_types: ['card'],
              line_items: [
                {
                  price: stripeConfig.plans.pro.priceId,
                  quantity: 1,
                },
              ],
              return_url: `${env.NEXT_PUBLIC_WEB_URL}/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`,
            })

          return {
            session: {
              id,
              clientSecret,
            },
          }
        } catch (error) {
          throw new NotFoundError('Could not create checkout session.')
        }
      },
    )
}
