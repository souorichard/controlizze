import z from 'zod'

import { recurrencesSchema } from '../models/recurrences.ts'

export const recurrencesSubject = z.tuple([
  z.union([
    z.literal('create'),
    z.literal('read'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('manage'),
  ]),
  z.union([z.literal('Recurrences'), recurrencesSchema]),
])

export type RecurrencesSubject = z.infer<typeof recurrencesSubject>
