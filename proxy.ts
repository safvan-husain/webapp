import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

const protectedRoutes = ['/dashboard', '/profile']
const publicRoutes = ['/login', '/register', '/']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  // Get session from cookie
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = await decrypt(cookie)

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect to dashboard if accessing public auth routes with valid session
  if (
    isPublicRoute &&
    session?.userId &&
    (path === '/login' || path === '/register')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
