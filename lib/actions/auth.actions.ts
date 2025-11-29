'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { RegisterSchema, LoginSchema } from '@/lib/validations/auth.schema'
import { registerUser, loginUser } from '@/lib/services/auth.service'
import { createSession, deleteSession } from '@/lib/session'
import { AppError } from '@/lib/errors/app-error'

export async function registerAction(prevState: any, formData: FormData) {
  const result = RegisterSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
    userType: formData.get('userType'),
  })

  if (!result.success) {
    return { 
      error: 'Validation failed', 
      fieldErrors: result.error.flatten().fieldErrors 
    }
  }

  try {
    const { user } = await registerUser(result.data)

    // Create session with new session management
    await createSession(user.id, user.userType)

    revalidatePath('/', 'layout')
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.details }
    }
    return { error: 'Registration failed. Please try again.' }
  }

  // Redirect to profile setup if no profile exists, otherwise dashboard
  redirect('/profile/setup')
}

export async function loginAction(prevState: any, formData: FormData) {
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { 
      error: 'Validation failed', 
      fieldErrors: result.error.flatten().fieldErrors 
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
    if (error instanceof AppError) {
      return { error: error.details }
    }
    return { error: 'Login failed. Please try again.' }
  }
}

export async function logoutAction() {
  await deleteSession()
  revalidatePath('/', 'layout')
  redirect('/')
}
