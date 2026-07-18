import { HTTPError } from 'ky'
import type { ActionResponse } from '@/interfaces/action'

export async function actionError(error: unknown): Promise<ActionResponse> {
  const defaultMessage =
    'An unexpected error occurred. Please try again later or contact support if the problem persists.'

  if (error instanceof HTTPError) {
    const data = (await error.data) as { message?: string } | undefined

    return {
      success: false,
      message: data?.message ?? defaultMessage,
    }
  }

  return {
    success: false,
    message: defaultMessage,
  }
}
