import z from 'zod'

export const typeSchema = z.enum(['EXPENSE', 'INCOME'])

export const statusSchema = z.enum(['PENDING', 'PAID', 'CANCELED'])

export const recurrenceStatusSchema = z.enum(['ACTIVE', 'PAUSED', 'CANCELED'])

export const frequencySchema = z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])

export const inviteStatusSchema = z.enum([
  'PENDING',
  'ACCEPTED',
  'REJECTED',
  'EXPIRED',
])
