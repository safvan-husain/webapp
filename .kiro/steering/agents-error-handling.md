# Error Handling & User Feedback

**Goal:** Provide detailed, actionable error feedback to users with expandable details and copy functionality.

---

## 🎯 Core Principles

1. **Never show generic error messages** - Always propagate specific error details
2. **Use toast notifications** for all errors (form submissions, server actions, API calls)
3. **Make errors expandable** - Show summary by default, full details on expand
4. **Provide copy functionality** - Users can copy error details for debugging/reporting
5. **Auto-dismiss only collapsed toasts** - Expanded toasts stay until manually closed

---

## 🏗 Implementation Architecture

### **1. Error Response Format**

All server actions and error handlers should return structured errors:

```ts
// lib/errors/app-error.ts
export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    public message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }

  toJSON() {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: new Date().toISOString(),
    };
  }
}
```

### **2. Server Action Error Handling**

Server actions must return detailed error information:

```ts
'use server'

export async function someAction(data: FormData) {
  try {
    // ... business logic
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          status: error.status,
          details: error.details,
          timestamp: new Date().toISOString(),
        }
      }
    }
    
    // Unexpected errors
    return {
      success: false,
      error: {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
        status: 500,
        details: {
          originalError: error instanceof Error ? error.message : String(error),
          stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
        },
        timestamp: new Date().toISOString(),
      }
    }
  }
}
```

### **3. Toast Component with Expandable Details**

Create a specialized error toast component:

```tsx
// components/ui/error-toast.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner' // or your toast library
import { Copy, ChevronDown, ChevronUp, X } from 'lucide-react'

interface ErrorDetails {
  message: string
  code?: string
  status?: number
  details?: Record<string, any>
  timestamp?: string
}

export function showErrorToast(error: ErrorDetails) {
  toast.custom(
    (t) => <ErrorToastContent error={error} toastId={t} />,
    {
      duration: Infinity, // Don't auto-dismiss
      position: 'top-right',
    }
  )
}

function ErrorToastContent({ error, toastId }: { error: ErrorDetails; toastId: string | number }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const copyToClipboard = async () => {
    const errorText = JSON.stringify(error, null, 2)
    await navigator.clipboard.writeText(errorText)
    toast.success('Error details copied to clipboard', { duration: 2000 })
  }

  const handleDismiss = () => {
    toast.dismiss(toastId)
  }

  return (
    <div className="bg-destructive text-destructive-foreground rounded-lg shadow-lg p-4 min-w-[320px] max-w-[500px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <p className="font-semibold text-sm">{error.message}</p>
          {error.code && (
            <p className="text-xs opacity-90 mt-1">Code: {error.code}</p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="text-destructive-foreground/80 hover:text-destructive-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-destructive-foreground/10 hover:bg-destructive-foreground/20 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              View Details
            </>
          )}
        </button>
        
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-destructive-foreground/10 hover:bg-destructive-foreground/20 transition-colors"
        >
          <Copy className="h-3 w-3" />
          Copy
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-destructive-foreground/20">
          <pre className="text-xs bg-black/20 p-2 rounded overflow-x-auto max-h-[300px] overflow-y-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
```

### **4. Usage in Forms/Components**

```tsx
'use client'

import { useTransition } from 'react'
import { someAction } from '@/lib/actions/some.actions'
import { showErrorToast } from '@/components/ui/error-toast'
import { toast } from 'sonner'

export function SomeForm() {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await someAction(formData)
      
      if (!result.success) {
        showErrorToast(result.error)
        return
      }
      
      toast.success('Action completed successfully')
      // ... handle success
    })
  }

  return (
    <form action={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={isPending}>
        Submit
      </button>
    </form>
  )
}
```

---

## 📋 Error Toast Behavior Rules

1. **Auto-dismiss collapsed toasts** after 5 seconds (configurable)
2. **Never auto-dismiss expanded toasts** - user must manually close
3. **Stack multiple errors** - don't replace, show all
4. **Copy includes full error object** - timestamp, code, details, stack (if dev)
5. **Show user-friendly message** in collapsed state
6. **Show technical details** in expanded state

---

## 🎨 Visual States

### **Collapsed State (Default)**
```
┌─────────────────────────────────────┐
│ ⚠️  Invalid email format         [X]│
│ Code: VALIDATION_ERROR              │
│                                     │
│ [▼ View Details] [📋 Copy]         │
└─────────────────────────────────────┘
```

### **Expanded State**
```
┌─────────────────────────────────────┐
│ ⚠️  Invalid email format         [X]│
│ Code: VALIDATION_ERROR              │
│                                     │
│ [▲ Hide Details] [📋 Copy]         │
│ ─────────────────────────────────── │
│ {                                   │
│   "message": "Invalid email",       │
│   "code": "VALIDATION_ERROR",       │
│   "status": 400,                    │
│   "details": { ... },               │
│   "timestamp": "2025-11-30..."      │
│ }                                   │
└─────────────────────────────────────┘
```

---

## 🔧 Configuration

### **Toast Provider Setup**

```tsx
// app/layout.tsx
import { Toaster } from 'sonner'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster 
          position="top-right"
          expand={false}
          richColors
        />
      </body>
    </html>
  )
}
```

---

## ✅ Checklist for Error Handling

When implementing error handling:

- [ ] Server action returns structured error object (not just string)
- [ ] Error includes: `message`, `code`, `status`, `details`, `timestamp`
- [ ] Use `showErrorToast()` instead of generic `toast.error()`
- [ ] Toast is expandable with "View Details" button
- [ ] Toast has "Copy" button for clipboard
- [ ] Expanded toast doesn't auto-dismiss
- [ ] Error details show full JSON in `<pre>` tag
- [ ] Development errors include stack traces
- [ ] Production errors hide sensitive information

---

## 🚫 Anti-Patterns (Don't Do This)

❌ **Generic error messages:**
```ts
return { error: 'Something went wrong' }
```

❌ **Simple string errors:**
```ts
toast.error('Failed to save')
```

❌ **No error details:**
```ts
catch (error) {
  return { success: false }
}
```

✅ **Do this instead:**
```ts
catch (error) {
  return {
    success: false,
    error: {
      message: 'Failed to save user',
      code: 'USER_SAVE_ERROR',
      status: 500,
      details: { userId, reason: error.message },
      timestamp: new Date().toISOString(),
    }
  }
}

showErrorToast(result.error)
```

---

## 📦 Required Dependencies

```json
{
  "dependencies": {
    "sonner": "^1.x.x",
    "lucide-react": "^0.x.x"
  }
}
```

---

## 🎯 Summary

- **Always propagate detailed errors** from server to client
- **Use `showErrorToast()`** for all error notifications
- **Make errors expandable** with full JSON details
- **Provide copy-to-clipboard** for easy bug reporting
- **Never auto-dismiss expanded toasts**
- **Include timestamps and error codes** for debugging
