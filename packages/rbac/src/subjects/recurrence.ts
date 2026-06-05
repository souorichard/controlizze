import z from 'zod'

import { recurrenceSchema } from '../models/recurrence.ts'

export const recurrenceSubject = z.tuple([
  z.union([
    z.literal('create'),
    z.literal('read'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('manage'),
  ]),
  z.union([z.literal('Recurrence'), recurrenceSchema]),
])

export type RecurrenceSubject = z.infer<typeof recurrenceSubject>
