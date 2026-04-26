import { sql } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../../db/index.ts'

export const healthCheck: FastifyPluginAsyncZod = async (app) => {
  app.get('/', async (request, reply) => {
    try {
      await db.execute(sql`select 1`)

      return {
        status: 'OK',
        database: 'OK',
        uptime: process.uptime(),
        timestamp: new Date(),
      }
    } catch {
      return reply.status(503).send({
        status: 'ERROR',
        database: 'UNAVAILABLE',
        uptime: process.uptime(),
        timestamp: new Date(),
      })
    }
  })
}
