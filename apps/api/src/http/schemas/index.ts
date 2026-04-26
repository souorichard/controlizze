import z from 'zod'

export const typeSchema = z.union([z.literal('EXPENSE'), z.literal('INCOME')])

export const statusSchema = z.union([
  z.literal('PENDING'),
  z.literal('COMPLETED'),
  z.literal('CANCELED'),
])
