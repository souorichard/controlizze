import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { authenticateWithGithub } from './auth/authenticate-with-github.ts'
import { authenticateWithGoogle } from './auth/authenticate-with-google.ts'
import { authenticateWithPassword } from './auth/authenticate-with-password.ts'
import { createCategory } from './categories/create-category.ts'
import { deleteCategory } from './categories/delete-category.ts'
import { getCategories } from './categories/get-categories.ts'
import { getCategory } from './categories/get-category.ts'
import { updateCategory } from './categories/update-category.ts'
import { getOrgMembers } from './members/get-org-members.ts'
import { removeMember } from './members/remove-member.ts'
import { updateMemberRole } from './members/update-member-role.ts'
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
import { createTransaction } from './transactions/create-transaction.ts'
import { deleteTransaction } from './transactions/delete-transaction.ts'
import { getTransactions } from './transactions/get-transactions.ts'
import { updateTransaction } from './transactions/update-transaction.ts'
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
    prefix: '/me/name',
  },
  {
    plugin: updateAccountAvatar,
    prefix: '/me/avatar',
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
    prefix: '/orgs/:slug',
  },
  {
    plugin: updateOrgName,
    prefix: '/orgs/:slug/name',
  },
  {
    plugin: updateOrgAvatar,
    prefix: '/orgs/:slug/avatar',
  },
  {
    plugin: shutdownOrg,
    prefix: '/orgs/:slug',
  },
  {
    plugin: transferOrg,
    prefix: '/orgs/:slug/owner',
  },
  {
    plugin: leaveOrg,
    prefix: '/orgs/:slug/leave',
  },
  {
    plugin: getOrgMembership,
    prefix: '/orgs/:slug/membership',
  },

  // Members
  {
    plugin: getOrgMembers,
    prefix: '/orgs/:slug/members',
  },
  {
    plugin: updateMemberRole,
    prefix: '/orgs/:slug/members/:memberId',
  },
  {
    plugin: removeMember,
    prefix: '/orgs/:slug/members/:memberId',
  },

  // Categories
  {
    plugin: createCategory,
    prefix: '/orgs/:slug/categories',
  },
  {
    plugin: getCategories,
    prefix: '/orgs/:slug/categories',
  },
  {
    plugin: getCategory,
    prefix: '/orgs/:slug/categories/:categorySlug',
  },
  {
    plugin: updateCategory,
    prefix: '/orgs/:slug/categories/:categorySlug',
  },
  {
    plugin: deleteCategory,
    prefix: '/orgs/:slug/categories/:categorySlug',
  },

  // Transactions
  {
    plugin: createTransaction,
    prefix: '/orgs/:slug/transactions',
  },
  {
    plugin: getTransactions,
    prefix: '/orgs/:slug/transactions',
  },
  {
    plugin: updateTransaction,
    prefix: '/orgs/:slug/transactions/:transactionId',
  },
  {
    plugin: deleteTransaction,
    prefix: '/orgs/:slug/transactions/:transactionId',
  },
]
