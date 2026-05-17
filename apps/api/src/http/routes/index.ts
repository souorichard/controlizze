import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import {
  authenticateWithGithub,
  authenticateWithGoogle,
  authenticateWithPassword,
  createAccount,
  requestPasswordRecover,
  resetPassword,
  verifyEmail,
} from './auth/index.ts'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from './categories/index.ts'
import {
  acceptInvite,
  createInvite,
  getInvite,
  getInvites,
  getPendingInvites,
  rejectInvite,
  revokeInvite,
} from './invites/index.ts'
import { getMembers, removeMember, updateMemberRole } from './members/index.ts'
import {
  getBalanceEvolutionMetrics,
  getTopExpenseCategoriesMetrics,
  getTransactionsAmountMetrics,
  getTransactionsBalanceAmountMetrics,
  getTransactionsPerPeriodMetrics,
} from './metrics/index.ts'
import {
  createOrg,
  getOrg,
  getOrgMembership,
  getOrgs,
  leaveOrg,
  shutdownOrg,
  transferOrg,
  updateOrgAvatar,
  updateOrgName,
} from './orgs/index.ts'
import {
  createRecurringTransaction,
  deleteRecurringTransaction,
  getRecurringTransactions,
  updateRecurringTransaction,
} from './recurring-transactions/index.ts'
import { healthCheck } from './server/index.ts'
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from './transactions/index.ts'
import {
  deleteAccount,
  getAccount,
  updateAccountAvatar,
  updateAccountName,
} from './users/index.ts'

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
    plugin: createAccount,
    prefix: '/accounts',
  },
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
  {
    plugin: requestPasswordRecover,
    prefix: '/sessions/forgot-password',
  },
  {
    plugin: resetPassword,
    prefix: '/sessions/forgot-password/reset',
  },
  {
    plugin: verifyEmail,
    prefix: '/sessions/verify-email',
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
    plugin: getMembers,
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

  // Invites
  {
    plugin: createInvite,
    prefix: '/orgs/:slug/invites',
  },
  {
    plugin: getInvite,
    prefix: '/invites',
  },
  {
    plugin: getInvites,
    prefix: '/orgs/:slug/invites',
  },
  {
    plugin: revokeInvite,
    prefix: '/orgs/:slug/invites/:inviteId',
  },
  {
    plugin: getPendingInvites,
    prefix: '/pending-invites',
  },
  {
    plugin: acceptInvite,
    prefix: '/invites/accept',
  },
  {
    plugin: rejectInvite,
    prefix: '/invites/reject',
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
    prefix: '/orgs/:slug/categories/:categoryId',
  },
  {
    plugin: updateCategory,
    prefix: '/orgs/:slug/categories/:categoryId',
  },
  {
    plugin: deleteCategory,
    prefix: '/orgs/:slug/categories/:categoryId',
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

  // Recurring transactions
  {
    plugin: createRecurringTransaction,
    prefix: '/orgs/:slug/recurring-transactions',
  },
  {
    plugin: getRecurringTransactions,
    prefix: '/orgs/:slug/recurring-transactions',
  },
  {
    plugin: updateRecurringTransaction,
    prefix: '/orgs/:slug/recurring-transactions/:recurringTransactionId',
  },
  {
    plugin: deleteRecurringTransaction,
    prefix: '/orgs/:slug/recurring-transactions/:recurringTransactionId',
  },

  // Metrics
  {
    plugin: getTransactionsAmountMetrics,
    prefix: '/orgs/:slug/metrics/transactions-amount',
  },
  {
    plugin: getTransactionsBalanceAmountMetrics,
    prefix: '/orgs/:slug/metrics/transactions-balance',
  },
  {
    plugin: getTransactionsPerPeriodMetrics,
    prefix: '/orgs/:slug/metrics/transactions-per-period',
  },
  {
    plugin: getTopExpenseCategoriesMetrics,
    prefix: '/orgs/:slug/metrics/top-expense-categories',
  },
  {
    plugin: getBalanceEvolutionMetrics,
    prefix: '/orgs/:slug/metrics/balance-evolution',
  },
]
