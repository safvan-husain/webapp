export interface ErrorDetails {
  message: string
  code?: string
  status?: number
  details?: Record<string, any>
  timestamp?: string
}

export interface ActionResult<T = any> {
  success: boolean
  data?: T
  error?: ErrorDetails
}
