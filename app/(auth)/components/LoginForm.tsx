'use client'

import { useActionState } from 'react'
import { loginAction } from '@/lib/actions/auth.actions'
import { Alert } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <Alert variant="destructive" title="Error">
          {state.error}
        </Alert>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
        {state?.fieldErrors?.email && (
          <p className="text-destructive text-sm mt-1">{state.fieldErrors.email[0]}</p>
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
        {state?.fieldErrors?.password && (
          <p className="text-destructive text-sm mt-1">{state.fieldErrors.password[0]}</p>
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
