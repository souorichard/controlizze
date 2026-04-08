import { createEnv } from '@t3-oss/env-nextjs'
import z from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    SERVER_PORT: z.coerce.number().default(3333),

    DATABASE_URL: z.url().startsWith('postgresql'),
  },
  client: {},
  shared: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SERVER_PORT: process.env.SERVER_PORT,

    DATABASE_URL: process.env.DATABASE_URL,
  },
  emptyStringAsUndefined: true,
})
