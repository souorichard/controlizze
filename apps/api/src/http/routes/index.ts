import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { authenticateWithGithub } from './auth/authenticate-with-github.ts'
import { authenticateWithGoogle } from './auth/authenticate-with-google.ts'
import { authenticateWithPassword } from './auth/authenticate-with-password.ts'
import { healthCheck } from './server/health-check.ts'
import { createAccount } from './users/create-account.ts'
import { deleteAccount } from './users/delete-account.ts'
import { getAccount } from './users/get-account.ts'
import { updateAccount } from './users/update-profile.ts'

type Route = {
  plugin: FastifyPluginAsyncZod
  prefix?: string
}

export const routes: Route[] = [
  {
    plugin: healthCheck,
    prefix: '/health',
  },

  // Users
  {
    plugin: createAccount,
    prefix: '/accounts',
  },
  {
    plugin: getAccount,
    prefix: '/me',
  },
  {
    plugin: updateAccount,
    prefix: '/me',
  },
  {
    plugin: deleteAccount,
    prefix: '/me',
  },

  // Authentication
  {
    plugin: authenticateWithPassword,
    prefix: '/sessions',
  },
  {
    plugin: authenticateWithGoogle,
    prefix: '/sessions/google',
  },
  {
    plugin: authenticateWithGithub,
    prefix: '/sessions/github',
  },
]
