import Link from "next/link";
import { getCurrentUser } from '@/lib/queries/auth.queries'

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full text-center px-6">
        <h1 className="text-5xl font-bold mb-4">Job Portal</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect companies with talented job seekers
        </p>
        
        {user ? (
          <div className="space-y-4">
            <p className="text-lg">Welcome back, {user.fullName}!</p>
            <Link
              href="/dashboard"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
