export interface ActionSuccess {
  success: true
  message?: string | null
  savedUrl?: string | null
}

export interface ActionError {
  success: false
  message: string
}

export type ActionResponse = ActionSuccess | ActionError
