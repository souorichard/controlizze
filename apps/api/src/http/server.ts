import { env } from '@controlizze/env'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import scalarFastifyApiReference from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { getExpensesAmount } from './routes/analysis/get-expenses-amount'
import { getRevenuesAmount } from './routes/analysis/get-revenues-amount'
import { getTotalBalanceAmount } from './routes/analysis/get-total-balance-amount'
import { getTransactionsPerPeriod } from './routes/analysis/get-transactions-per-period'
import { authenticateWithGithub } from './routes/auth/authenticate-with-github'
import { authenticateWithGoogle } from './routes/auth/authenticate-with-google'
import { authenticateWithPassword } from './routes/auth/autheticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { deleteProfile } from './routes/auth/delete-profile'
import { getProfile } from './routes/auth/get-profile'
import { requestPasswordRecover } from './routes/auth/request-password-recover'
import { resetPassword } from './routes/auth/reset-password'
import { updateProfileEmail } from './routes/auth/update-profile-email'
import { updateProfileName } from './routes/auth/update-profile-name'
import { acceptInvite } from './routes/invite/accept-invite'
import { createInvite } from './routes/invite/create-invite'
import { getInvite } from './routes/invite/get-invite'
import { getInvites } from './routes/invite/get-invites'
import { getPendingInvites } from './routes/invite/get-pending-invites'
import { rejectInvite } from './routes/invite/reject-invite'
import { revokeInvite } from './routes/invite/revoke-invite'
import { getMembers } from './routes/member/get-members'
import { removeMember } from './routes/member/remove-member'
import { updateMember } from './routes/member/update-member'
import { createOrganization } from './routes/organization/create-organization'
import { getMembership } from './routes/organization/get-membership'
import { getOrganization } from './routes/organization/get-organization'
import { getOrganizations } from './routes/organization/get-organizations'
import { leaveOrganization } from './routes/organization/leave-organization'
import { shutdownOrganization } from './routes/organization/shutdown-organization'
import { transferOrganization } from './routes/organization/transfer-organization'
import { updateOrganization } from './routes/organization/update-organization'
import { updateOrganizationDomain } from './routes/organization/update-organization-domain'
import { updateOrganizationName } from './routes/organization/update-organization-name'
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

// Routes
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(authenticateWithGithub)
app.register(authenticateWithGoogle)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(getProfile)
app.register(updateProfileName)
app.register(updateProfileEmail)
app.register(deleteProfile)

app.register(createOrganization)
app.register(getMembership)
app.register(getOrganizations)
app.register(getOrganization)
app.register(updateOrganization)
app.register(updateOrganizationName)
app.register(updateOrganizationDomain)
app.register(shutdownOrganization)
app.register(transferOrganization)
app.register(leaveOrganization)

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
app.register(acceptInvite)
app.register(rejectInvite)
app.register(revokeInvite)
app.register(getPendingInvites)

app.register(getExpensesAmount)
app.register(getRevenuesAmount)
app.register(getTotalBalanceAmount)
app.register(getTransactionsPerPeriod)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log('HTTP server running!')
})
