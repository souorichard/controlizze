import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const healthCheck: FastifyPluginAsyncZod = async (app) => {
  app.get('/', async () => {
    return 'OK!'
  })
}
