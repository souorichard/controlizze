import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '../env.ts'
import { routes } from './routes/index.ts'

export function buildApp() {
  const app = fastify()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.register(fastifyCors, {
    origin: '*',
    methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  })

  for (const route of routes) {
    app.register(route.plugin, { prefix: route.prefix })
  }

  return app
}
