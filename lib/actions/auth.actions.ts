'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { RegisterSchema, LoginSchema } from '@/lib/validations/auth.schema'
import { registerUser, loginUser } from '@/lib/services/auth.service'
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
    const { user, token } = await registerUser(result.data)

    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    revalidatePath('/', 'layout')
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.details }
    }
    return { error: 'Registration failed. Please try again.' }
  }

  redirect('/dashboard')
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
    const { user, token } = await loginUser(result.data)

    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    revalidatePath('/', 'layout')
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.details }
    }
    return { error: 'Login failed. Please try again.' }
  }

  redirect('/dashboard')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  revalidatePath('/', 'layout')
  redirect('/login')
}
