'use client'

import { useActionState } from 'react'
import { registerAction } from '@/lib/actions/auth.actions'

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Enter your full name"
          required
          className="w-full px-3 py-2 border rounded"
        />
        {state?.fieldErrors?.fullName && (
          <p className="text-red-600 text-sm mt-1">{state.fieldErrors.fullName[0]}</p>
        )}
      </div>

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
          placeholder="Min. 8 characters"
          required
          className="w-full px-3 py-2 border rounded"
        />
        {state?.fieldErrors?.password && (
          <p className="text-red-600 text-sm mt-1">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">I am a:</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="userType"
              value="SEEKER"
              required
              className="mr-2"
            />
            Job Seeker
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="userType"
              value="COMPANY"
              required
              className="mr-2"
            />
            Company
          </label>
        </div>
        {state?.fieldErrors?.userType && (
          <p className="text-red-600 text-sm mt-1">{state.fieldErrors.userType[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </form>
  )
}
