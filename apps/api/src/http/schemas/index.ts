import z from 'zod'

export const typeSchema = z.union([z.literal('EXPENSE'), z.literal('INCOME')])

export const statusSchema = z
  .union([z.literal('PENDING'), z.literal('COMPLETED'), z.literal('CANCELED')])
  .default('PENDING')

export const recurringStatusSchema = z
  .union([z.literal('ACTIVE'), z.literal('PAUSED'), z.literal('CANCELED')])
  .default('ACTIVE')

export const frequencySchema = z
  .union([
    z.literal('DAILY'),
    z.literal('WEEKLY'),
    z.literal('MONTHLY'),
    z.literal('YEARLY'),
  ])
  .default('DAILY')

export const inviteStatusSchema = z
  .union([
    z.literal('PENDING'),
    z.literal('ACCEPTED'),
    z.literal('REJECTED'),
    z.literal('REJECTED'),
    z.literal('EXPIRED'),
  ])
  .default('PENDING')
