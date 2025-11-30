import { redirect } from 'next/navigation'
import { getUserWithProfile } from '@/lib/dal'
import { UserType } from '@prisma/client'
import SeekerEditForm from './seeker-form'
import CompanyEditForm from './company-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ProfileEditPage() {
  const user = await getUserWithProfile()

  if (!user) {
    redirect('/login')
  }

  // Redirect to setup if no profile exists
  if (!user.refObjectId) {
    redirect('/profile/setup')
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              ← Back to Profile
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-semibold mb-2 tracking-tight">Edit Profile</h1>
        <p className="text-muted-foreground mb-8">
          Update your profile information
        </p>

        {user.userType === UserType.SEEKER && user.seekerProfile ? (
          <SeekerEditForm userId={user.id} profile={user.seekerProfile} />
        ) : user.userType === UserType.COMPANY && user.companyProfile ? (
          <CompanyEditForm userId={user.id} profile={user.companyProfile} />
        ) : (
          <div className="bg-card border border-border rounded-lg shadow-sm p-6">
            <p className="text-muted-foreground">Profile data not found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
