import { FastifyInstance, FastifyRequest, RouteGenericInterface } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { getCurrentOrganizationPlan } from '@/utils/get-current-organization-plan'

import { UnauthorizedError } from '../routes/_errors/unauthorized-error'

interface Params extends RouteGenericInterface {
  Params: { slug: string }
}

export const checkPlan = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request: FastifyRequest<Params>) => {
    const organizationSlug = request.params.slug

    const { subscription } = await getCurrentOrganizationPlan(organizationSlug)

    if (subscription.name === 'free') {
      throw new UnauthorizedError(
        'This action is not allowed on the free plan.',
      )
    }
  })
})
