import { getUser } from '@/lib/dal'
import { logoutAction } from '@/lib/actions/auth.actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    // This shouldn't happen as verifySession redirects, but keep as safety
    return null
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-semibold mb-2 tracking-tight">Welcome, {user.fullName}!</h1>
              <p className="text-muted-foreground">User Type: {user.userType}</p>
              <p className="text-muted-foreground">Email: {user.email}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/profile">
                <Button variant="outline">
                  View Profile
                </Button>
              </Link>
              <form action={logoutAction}>
                <Button 
                  type="submit"
                  variant="destructive"
                >
                  Logout
                </Button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-border pt-6">
            {user.userType === 'COMPANY' ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Company Dashboard</h2>
                <p className="text-muted-foreground">Post jobs, manage applications, view candidates...</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Job Seeker Dashboard</h2>
                <p className="text-muted-foreground">Browse jobs, manage applications, update profile...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
