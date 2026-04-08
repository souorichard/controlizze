import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { healthCheck } from './server/health-check.ts'

type Route = {
  plugin: FastifyPluginAsyncZod
  prefix?: string
}

export const routes: Route[] = [
  {
    plugin: healthCheck,
    prefix: '/health',
  },
]
