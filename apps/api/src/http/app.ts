import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import scalarFastifyApiReference from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '../env.ts'
import { errorHandler } from './error-handler.ts'
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

  app.setErrorHandler(errorHandler)

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Controlizze API',
        description:
          'Full-stack SaaS app with multi-tenant architecture & RBAC.',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  })

  app.register(scalarFastifyApiReference, {
    routePrefix: '/docs',
    configuration: {
      theme: 'deepSpace',
      metaData: {
        title: 'Controlizze API',
      },
    },
  })

  for (const route of routes) {
    app.register(route.plugin, { prefix: route.prefix })
  }

  return app
}
