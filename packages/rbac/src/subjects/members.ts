import z from 'zod'

export const memberSubject = z.tuple([
  z.union([
    z.literal('create'),
    z.literal('read'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('manage'),
  ]),
  z.literal('Member'),
])

export type MemberSubject = z.infer<typeof memberSubject>
