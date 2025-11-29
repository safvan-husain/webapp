'use client'

import { useActionState, useEffect } from 'react'
import { registerAction } from '@/lib/actions/auth.actions'
import { showErrorToast } from '@/components/ui/error-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null)

  useEffect(() => {
    if (state && !state.success && state.error) {
      showErrorToast(state.error)
    }
  }, [state])

  return (
    <form action={formAction} className="space-y-4">

      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Enter your full name"
          required
        />
        {state?.error?.details?.fullName && (
          <p className="text-destructive text-sm mt-1">{state.error.details.fullName[0]}</p>
        )}
      </div>

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
          placeholder="Min. 8 characters"
          required
        />
        {state?.error?.details?.password && (
          <p className="text-destructive text-sm mt-1">{state.error.details.password[0]}</p>
        )}
      </div>

      <div>
        <Label className="mb-2">I am a:</Label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="userType"
              value="SEEKER"
              required
              className="mr-2 cursor-pointer"
            />
            <span className="text-sm">Job Seeker</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="userType"
              value="COMPANY"
              required
              className="mr-2 cursor-pointer"
            />
            <span className="text-sm">Company</span>
          </label>
        </div>
        {state?.error?.details?.userType && (
          <p className="text-destructive text-sm mt-1">{state.error.details.userType[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full"
      >
        {isPending ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </form>
  )
}
