'use client'

import { useActionState, useEffect } from 'react'
import { loginAction } from '@/lib/actions/auth.actions'
import { showErrorToast } from '@/components/ui/error-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  useEffect(() => {
    if (state && !state.success && state.error) {
      showErrorToast(state.error)
    }
  }, [state])

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
        {state?.error?.details?.email && (
          <p className="text-destructive text-sm mt-1">{state.error.details.email[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
        />
        {state?.error?.details?.password && (
          <p className="text-destructive text-sm mt-1">{state.error.details.password[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full"
      >
        {isPending ? 'Logging in...' : 'Login'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link href="/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </form>
  )
}
