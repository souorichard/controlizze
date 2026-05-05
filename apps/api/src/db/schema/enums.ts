import { pgEnum } from 'drizzle-orm/pg-core'

export const accountProviderEnum = pgEnum('account_enum', ['GOOGLE', 'GITHUB'])

export const tokenTypeEnum = pgEnum('token_type_enum', ['PASSWORD_RECOVER'])

export const roleEnum = pgEnum('role_enum', ['OWNER', 'ADMIN', 'MEMBER'])

export const planEnum = pgEnum('plan_enum', ['FREE', 'PRO'])

export const billingCycleEnum = pgEnum('billing_cycle', ['MONTHLY', 'YEARLY'])

export const typeEnum = pgEnum('type_enum', ['EXPENSE', 'INCOME'])

export const statusEnum = pgEnum('status_enum', [
  'PENDING',
  'COMPLETED',
  'CANCELED',
])

export const recurringStatusEnum = pgEnum('recurring_status_enum', [
  'ACTIVE',
  'PAUSED',
  'CANCELED',
])

export const frequencyEnum = pgEnum('frequency_enum', [
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY',
])

export const inviteStatusEnum = pgEnum('invite_status_enum', [
  'PENDING',
  'ACCEPTED',
  'REJECTED',
  'EXPIRED',
])
