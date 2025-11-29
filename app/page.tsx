import Link from "next/link";
import { getCurrentUser } from '@/lib/queries/auth.queries'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="max-w-2xl w-full text-center px-6">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">Job Portal</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Connect companies with talented job seekers
        </p>
        
        {user ? (
          <div className="space-y-4">
            <p className="text-lg">Welcome back, {user.fullName}!</p>
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">Register</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
