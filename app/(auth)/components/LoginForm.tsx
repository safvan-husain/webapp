'use client'

import { useActionState } from 'react'
import { loginAction } from '@/lib/actions/auth.actions'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="w-full px-3 py-2 border rounded"
        />
        {state?.fieldErrors?.email && (
          <p className="text-red-600 text-sm mt-1">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
          className="w-full px-3 py-2 border rounded"
        />
        {state?.fieldErrors?.password && (
          <p className="text-red-600 text-sm mt-1">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center text-sm">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Register
        </a>
      </p>
    </form>
  )
}
