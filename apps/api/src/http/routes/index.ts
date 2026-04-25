import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { authenticateWithGithub } from './auth/authenticate-with-github.ts'
import { authenticateWithGoogle } from './auth/authenticate-with-google.ts'
import { authenticateWithPassword } from './auth/authenticate-with-password.ts'
import { createOrg } from './orgs/create-org.ts'
import { getOrgMembership } from './orgs/get-membership.ts'
import { getOrg } from './orgs/get-org.ts'
import { getOrgs } from './orgs/get-orgs.ts'
import { leaveOrg } from './orgs/leave-org.ts'
import { shutdownOrg } from './orgs/shutdown-org.ts'
import { transferOrg } from './orgs/transfer-org.ts'
import { updateOrgAvatar } from './orgs/update-org-avatar.ts'
import { updateOrgName } from './orgs/update-org-name.ts'
import { healthCheck } from './server/health-check.ts'
import { createAccount } from './users/create-account.ts'
import { deleteAccount } from './users/delete-account.ts'
import { getAccount } from './users/get-account.ts'
import { updateAccountAvatar } from './users/update-account-avatar.ts'
import { updateAccountName } from './users/update-account-name.ts'

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
    plugin: updateAccountName,
    prefix: '/me',
  },
  {
    plugin: updateAccountAvatar,
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

  // Organizations
  {
    plugin: createOrg,
    prefix: '/orgs',
  },
  {
    plugin: getOrgs,
    prefix: '/orgs',
  },
  {
    plugin: getOrg,
    prefix: '/orgs',
  },
  {
    plugin: updateOrgName,
    prefix: '/orgs',
  },
  {
    plugin: updateOrgAvatar,
    prefix: '/orgs',
  },
  {
    plugin: shutdownOrg,
    prefix: '/orgs',
  },
  {
    plugin: transferOrg,
    prefix: '/orgs',
  },
  {
    plugin: leaveOrg,
    prefix: '/orgs',
  },
  {
    plugin: getOrgMembership,
    prefix: '/orgs',
  },
]
