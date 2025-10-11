import z from 'zod'

export const categorySubject = z.tuple([
  z.union([
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('manage'),
  ]),
  z.literal('Category'),
])

export type CategorySubject = z.infer<typeof categorySubject>
