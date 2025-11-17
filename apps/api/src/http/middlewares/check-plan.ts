import { FastifyInstance, FastifyRequest, RouteGenericInterface } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { getOrganizationPlan } from '@/utils/get-organization-plan'

import { UnauthorizedError } from '../routes/_errors/unauthorized-error'

interface Params extends RouteGenericInterface {
  Params: { slug: string }
}

export const checkPlan = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request: FastifyRequest<Params>) => {
    const organization = request.params.slug

    const plan = await getOrganizationPlan(organization)

    if (plan === 'free') {
      throw new UnauthorizedError(
        'This action is not allowed on the free plan.',
      )
    }
  })
})
