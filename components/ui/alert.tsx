import { HTMLAttributes, forwardRef } from 'react'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'destructive'
  title?: string
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className = '', variant = 'info', title, children, ...props }, ref) => {
    const variants = {
      info: 'bg-primary/10 border-primary/20 text-primary',
      success: 'bg-success/10 border-success/20 text-success',
      warning: 'bg-warning/10 border-warning/20 text-warning',
      destructive: 'bg-destructive/10 border-destructive/20 text-destructive',
    }
    
    return (
      <div
        ref={ref}
        className={`p-4 rounded-lg border ${variants[variant]} ${className}`}
        role="alert"
        {...props}
      >
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={title ? 'text-sm mt-1' : 'text-sm'}>{children}</div>}
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export { Alert }
