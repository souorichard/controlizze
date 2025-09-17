import { env } from '@controlizze/env'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import scalarFastifyApiReference from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { registerRoutes } from './routes'

export function buildApp() {
  const app = fastify().withTypeProvider<ZodTypeProvider>()

  // CORS
  app.register(fastifyCors)

  // Serializer and Validator of Zod
  app.setSerializerCompiler(serializerCompiler)
  app.setValidatorCompiler(validatorCompiler)

  // Error Handler
  app.setErrorHandler(errorHandler)

  // Swagger
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
      theme: 'kepler',
    },
  })

  // JWT
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  })

  registerRoutes(app)

  return app
}
