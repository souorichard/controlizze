import { FastifyInstance } from 'fastify'

import { getExpensesAmount } from './analysis/get-expenses-amount'
import { getRevenuesAmount } from './analysis/get-revenues-amount'
import { getTopExpenseCategories } from './analysis/get-top-expense-categories'
import { getTopRevenueCategories } from './analysis/get-top-revenue-categories'
import { getTotalBalanceAmount } from './analysis/get-total-balance-amount'
import { getTransactionsPerPeriod } from './analysis/get-transactions-per-period'
import { authenticateWithGithub } from './auth/authenticate-with-github'
import { authenticateWithGoogle } from './auth/authenticate-with-google'
import { authenticateWithPassword } from './auth/autheticate-with-password'
import { createAccount } from './auth/create-account'
import { deleteProfile } from './auth/delete-profile'
import { getProfile } from './auth/get-profile'
import { requestPasswordRecover } from './auth/request-password-recover'
import { resetPassword } from './auth/reset-password'
import { uploadProfileAvatar } from './auth/storage/upload-profile-avatar'
import { updateProfileAvatar } from './auth/update-profile-avatar'
import { updateProfileEmail } from './auth/update-profile-email'
import { updateProfileName } from './auth/update-profile-name'
import { createCategory } from './category/create-category'
import { deleteCategory } from './category/delete-category'
import { getCategories } from './category/get-categories'
import { updateCategory } from './category/update-category'
import { acceptInvite } from './invite/accept-invite'
import { createInvite } from './invite/create-invite'
import { getInvite } from './invite/get-invite'
import { getInvites } from './invite/get-invites'
import { getPendingInvites } from './invite/get-pending-invites'
import { rejectInvite } from './invite/reject-invite'
import { revokeInvite } from './invite/revoke-invite'
import { getMembers } from './member/get-members'
import { removeMember } from './member/remove-member'
import { updateMember } from './member/update-member'
import { createOrganization } from './organization/create-organization'
import { getMembership } from './organization/get-membership'
import { getOrganization } from './organization/get-organization'
import { getOrganizations } from './organization/get-organizations'
import { leaveOrganization } from './organization/leave-organization'
import { shutdownOrganization } from './organization/shutdown-organization'
import { uploadOrganizationAvatar } from './organization/storage/upload-organization-avatar'
import { transferOrganization } from './organization/transfer-organization'
import { updateOrganization } from './organization/update-organization'
import { updateOrganizationAvatar } from './organization/update-organization-avatar'
import { updateOrganizationDomain } from './organization/update-organization-domain'
import { updateOrganizationName } from './organization/update-organization-name'
import { changeTransationStatus } from './transaction/change-transaction-status'
import { createTransation } from './transaction/create-transaction'
import { deleteTransation } from './transaction/delete-transaction'
import { getTransation } from './transaction/get-transaction'
import { getTransations } from './transaction/get-transactions'
import { updateTransation } from './transaction/update-transaction'

export async function registerRoutes(app: FastifyInstance) {
  // Auth
  app.register(createAccount)
  app.register(authenticateWithPassword)
  app.register(authenticateWithGithub)
  app.register(authenticateWithGoogle)
  app.register(requestPasswordRecover)
  app.register(resetPassword)
  app.register(getProfile)
  app.register(updateProfileName)
  app.register(updateProfileEmail)
  app.register(updateProfileAvatar)
  app.register(deleteProfile)

  // Organization
  app.register(createOrganization)
  app.register(getMembership)
  app.register(getOrganizations)
  app.register(getOrganization)
  app.register(updateOrganization)
  app.register(updateOrganizationName)
  app.register(updateOrganizationDomain)
  app.register(updateOrganizationAvatar)
  app.register(shutdownOrganization)
  app.register(transferOrganization)
  app.register(leaveOrganization)

  // Category
  app.register(createCategory)
  app.register(getCategories)
  app.register(updateCategory)
  app.register(deleteCategory)

  // Transaction
  app.register(createTransation)
  app.register(getTransations)
  app.register(getTransation)
  app.register(updateTransation)
  app.register(deleteTransation)
  app.register(changeTransationStatus)

  // Members
  app.register(getMembers)
  app.register(updateMember)
  app.register(removeMember)

  // Invites
  app.register(createInvite)
  app.register(getInvite)
  app.register(getInvites)
  app.register(acceptInvite)
  app.register(rejectInvite)
  app.register(revokeInvite)
  app.register(getPendingInvites)

  // Analysis
  app.register(getExpensesAmount)
  app.register(getRevenuesAmount)
  app.register(getTotalBalanceAmount)
  app.register(getTransactionsPerPeriod)
  app.register(getTopExpenseCategories)
  app.register(getTopRevenueCategories)

  // Storage
  app.register(uploadProfileAvatar)
  app.register(uploadOrganizationAvatar)
}
