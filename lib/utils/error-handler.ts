import { AppError } from '@/lib/errors/app-error'
import type { ErrorDetails } from '@/lib/errors/types'

export function handleServerError(error: unknown): ErrorDetails {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details,
      timestamp: new Date().toISOString(),
    }
  }

  // Unexpected errors
  return {
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    status: 500,
    details: {
      originalError: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
    },
    timestamp: new Date().toISOString(),
  }
}
