import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authenticateWithPassword } from './routes/auth/autheticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { requestPasswordRecover } from './routes/auth/request-password-recover'
import { resetPassword } from './routes/auth/reset-password'

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
      description: 'Full-stack SaaS app with multi-tenant architecture & RBAC.',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

// JWT
app.register(fastifyJwt, {
  secret: 'secret',
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

// Routes
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(getProfile)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})
