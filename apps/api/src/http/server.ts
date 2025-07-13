import { env } from '@controlizze/env'
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
import { authenticateWithGithub } from './routes/auth/authenticate-with-github'
import { authenticateWithPassword } from './routes/auth/autheticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { requestPasswordRecover } from './routes/auth/request-password-recover'
import { resetPassword } from './routes/auth/reset-password'
import { createInvite } from './routes/invite/create-invite'
import { getInvite } from './routes/invite/get-invite'
import { getInvites } from './routes/invite/get-invites'
import { getMembers } from './routes/member/get-members'
import { removeMember } from './routes/member/remove-member'
import { updateMember } from './routes/member/update-member'
import { createOrganization } from './routes/organization/create-organization'
import { getMembership } from './routes/organization/get-membership'
import { getOrganization } from './routes/organization/get-organization'
import { getOrganizations } from './routes/organization/get-organizations'
import { shutdownOrganization } from './routes/organization/shutdown-organization'
import { transferOrganization } from './routes/organization/transfer-organization'
import { updateOrganization } from './routes/organization/update-organization'
import { changeTransationStatus } from './routes/transaction/change-transaction-status'
import { createTransation } from './routes/transaction/create-transaction'
import { deleteTransation } from './routes/transaction/delete-transaction'
import { getTransation } from './routes/transaction/get-transaction'
import { getTransations } from './routes/transaction/get-transactions'
import { updateTransation } from './routes/transaction/update-transaction'

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

// JWT
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

// Routes
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(authenticateWithGithub)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(getProfile)

app.register(createOrganization)
app.register(getMembership)
app.register(getOrganizations)
app.register(getOrganization)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)

app.register(createTransation)
app.register(getTransations)
app.register(getTransation)
app.register(updateTransation)
app.register(deleteTransation)
app.register(changeTransationStatus)

app.register(getMembers)
app.register(updateMember)
app.register(removeMember)

app.register(createInvite)
app.register(getInvite)
app.register(getInvites)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log('HTTP server running!')
})
