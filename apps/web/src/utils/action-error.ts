import { HTTPError } from 'ky'
import type { ActionResponse } from '@/interfaces/action-interface'

export async function actionError(error: unknown): Promise<ActionResponse> {
  if (error instanceof HTTPError) {
    const { message } = await error.response.clone().json()

    return {
      success: false,
      message,
    }
  }

  return {
    success: false,
    message: 'Ocorreu um erro inesperado. Por favor, tente novamente',
  }
}
