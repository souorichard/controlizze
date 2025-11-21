import { type FastifyInstance, FastifyRequest } from 'fastify'
import getRawBody from 'raw-body'
import { Stripe } from 'stripe'

import {
  handleProcessWebhookCheckout,
  handleProcessWebhookUpdatedSubscription,
  stripe,
} from '@/services/stripe'
import { stripeConfig } from '@/services/stripe/config'

export async function stripeWebhook(app: FastifyInstance) {
  app.addContentTypeParser('application/json', async (req: FastifyRequest) => {
    // raw-body espera req.raw (IncomingMessage)
    const raw = await getRawBody(req.raw, {
      length: req.headers['content-length'],
      limit: '1mb',
    })

    return raw // Fastify coloca em request.body
  })

  app.post('/stripe/webhook', async (request, reply) => {
    let event: Stripe.Event | undefined
    const webhookSecret = stripeConfig.webhookSecret

    const rawBody = request.body as Buffer

    if (webhookSecret) {
      const signature = request.headers['stripe-signature'] as string

      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          signature,
          webhookSecret,
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.log(`⚠️ Webhook signature verification failed.`, err.message)
        return reply.status(400).send()
      }
    }

    if (!event) {
      return reply.status(400).send('No event received')
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await handleProcessWebhookCheckout(event.data)
        break
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleProcessWebhookUpdatedSubscription(event.data)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return reply.status(200).send()
  })
}
