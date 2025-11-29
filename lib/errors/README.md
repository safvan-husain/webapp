# Error Handling System

This project uses a comprehensive error handling system with expandable toast notifications.

## Quick Start

### 1. In Server Actions

```ts
'use server'

import { handleServerError } from '@/lib/utils/error-handler'
import type { ActionResult } from '@/lib/errors/types'

export async function myAction(data: FormData): Promise<ActionResult> {
  // Validation errors
  const result = MySchema.safeParse(data)
  if (!result.success) {
    return {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        status: 400,
        details: result.error.flatten().fieldErrors,
        timestamp: new Date().toISOString(),
      }
    }
  }

  try {
    // Business logic
    const data = await myService(result.data)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: handleServerError(error)
    }
  }
}
```

### 2. In Client Components

```tsx
'use client'

import { useActionState, useEffect } from 'react'
import { myAction } from '@/lib/actions/my.actions'
import { showErrorToast } from '@/components/ui/error-toast'
import { toast } from 'sonner'

export function MyForm() {
  const [state, formAction, isPending] = useActionState(myAction, null)

  useEffect(() => {
    if (state && !state.success && state.error) {
      showErrorToast(state.error)
    }
  }, [state])

  return (
    <form action={formAction}>
      {/* form fields */}
    </form>
  )
}
```

### 3. In Services (Throw AppError)

```ts
import { AppError } from '@/lib/errors/app-error'

export async function myService(data: any) {
  const existing = await prisma.item.findUnique({ where: { id: data.id } })
  
  if (!existing) {
    throw new AppError(
      404,
      'ITEM_NOT_FOUND',
      'Item not found',
      { itemId: data.id }
    )
  }
  
  // ... business logic
}
```

## Features

- **Expandable toasts** - Click "View Details" to see full error JSON
- **Copy to clipboard** - Click "Copy" to copy error details
- **Auto-dismiss** - Collapsed toasts dismiss after 5s, expanded stay open
- **Field-level errors** - Validation errors show under form fields
- **Stack traces** - Development mode includes stack traces

## Error Structure

```ts
interface ErrorDetails {
  message: string        // User-friendly message
  code?: string         // Error code (e.g., 'VALIDATION_ERROR')
  status?: number       // HTTP status code
  details?: object      // Additional context
  timestamp?: string    // ISO timestamp
}
```

## Examples

See `LoginForm.tsx` and `RegisterForm.tsx` for complete examples.
