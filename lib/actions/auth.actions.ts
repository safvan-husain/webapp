'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { RegisterSchema, LoginSchema } from '@/lib/validations/auth.schema'
import { registerUser, loginUser } from '@/lib/services/auth.service'
import { createSession, deleteSession } from '@/lib/session'
import { handleServerError } from '@/lib/utils/error-handler'
import type { ActionResult } from '@/lib/errors/types'

export async function registerAction(prevState: any, formData: FormData): Promise<ActionResult> {
  const result = RegisterSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
    userType: formData.get('userType'),
  })

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
    const { user } = await registerUser(result.data)

    // Create session with new session management
    await createSession(user.id, user.userType)

    revalidatePath('/', 'layout')
  } catch (error) {
    return {
      success: false,
      error: handleServerError(error)
    }
  }

  // Redirect to profile setup if no profile exists, otherwise dashboard
  redirect('/profile/setup')
}

export async function loginAction(prevState: any, formData: FormData): Promise<ActionResult> {
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

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
    const { user } = await loginUser(result.data)

    // Create session with new session management
    await createSession(user.id, user.userType)

    revalidatePath('/', 'layout')

    // Redirect based on profile completion
    if (!user.refObjectId) {
      redirect('/profile/setup')
    } else {
      redirect('/dashboard')
    }
  } catch (error) {
    return {
      success: false,
      error: handleServerError(error)
    }
  }
}

export async function logoutAction() {
  await deleteSession()
  revalidatePath('/', 'layout')
  redirect('/')
}
