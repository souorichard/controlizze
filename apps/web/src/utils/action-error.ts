import { HTTPError } from 'ky'
import type { ActionResponse } from '@/interfaces/action-interface'

export async function actionError(error: unknown): Promise<ActionResponse> {
  const defaultMessage =
    'Ocorreu um erro inesperado. Por favor, tente novamente'

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
