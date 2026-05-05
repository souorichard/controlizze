import z from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  SERVER_PORT: z.coerce.number().default(3333),

  DATABASE_URL: z.url().startsWith('postgresql'),

  API_URL: z.url(),
  WEB_URL: z.url(),

  JWT_SECRET: z.string(),

  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  RESEND_API_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
