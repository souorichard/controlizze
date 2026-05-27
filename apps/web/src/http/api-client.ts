import ky from 'ky'
import { env } from '@/env'

export const api = ky.create({
  baseUrl: env.API_URL,
})
