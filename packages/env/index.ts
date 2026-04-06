import { createEnv } from '@t3-oss/env-nextjs'
import z from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    SERVER_PORT: z.coerce.number().default(3333),
  },
  client: {},
  shared: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SERVER_PORT: process.env.SERVER_PORT,
  },
  emptyStringAsUndefined: true,
})
