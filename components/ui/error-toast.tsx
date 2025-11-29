'use client'

import { useState } from 'react'
import { toast } from 'sonner'
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
      duration: 5000,
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
    <div className="bg-red-600 text-white rounded-lg shadow-lg p-4 min-w-[320px] max-w-[500px]">
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
          className="text-white/80 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
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
          className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Copy className="h-3 w-3" />
          Copy
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <pre className="text-xs bg-black/20 p-2 rounded overflow-x-auto max-h-[300px] overflow-y-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
