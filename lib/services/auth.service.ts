import { prisma } from '@/lib/db/prisma'
import { AppError } from '@/lib/errors/app-error'
import { hashPassword, verifyPassword } from '@/lib/utils/password'
import { generateToken } from '@/lib/utils/jwt'
import type { RegisterInput, LoginInput } from '@/lib/validations/auth.schema'

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email }
  })

  if (existingUser) {
    throw new AppError(409, 'USER_ALREADY_EXISTS', 'Email already registered')
  }

  const passwordHash = await hashPassword(input.password)

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      userType: input.userType,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      userType: true,
      refObjectId: true,
      createdAt: true,
    }
  })

  const token = generateToken({
    userId: user.id,
    email: user.email,
    userType: user.userType,
  })

  return { user, token }
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email }
  })

  if (!user) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')
  }

  const isValid = await verifyPassword(input.password, user.passwordHash)
  if (!isValid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')
  }

  if (!user.isActive) {
    throw new AppError(403, 'ACCOUNT_SUSPENDED', 'Account has been suspended')
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    userType: user.userType,
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      userType: user.userType,
      refObjectId: user.refObjectId,
      createdAt: user.createdAt,
    },
    token,
  }
}
