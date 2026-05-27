import z from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  API_URL: z.url(),
  NEXT_PUBLIC_WEB_URL: z.url(),

  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),

  NEXT_PUBLIC_GITHUB_CLIENT_ID: z.string(),
})

export const env = envSchema.parse(process.env)
