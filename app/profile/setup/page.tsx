import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/dal'
import { UserType } from '@prisma/client'
import SeekerProfileForm from './seeker-form'
import CompanyProfileForm from './company-form'

export default async function ProfileSetupPage() {
  const session = await verifySession()

  // Redirect to dashboard if profile already exists
  // This check will be done by querying the user's refObjectId
  // For now, we'll show the appropriate form based on userType

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-gray-600 mb-8">
          Help us understand you better to find the perfect matches
        </p>

        {session.userType === UserType.SEEKER ? (
          <SeekerProfileForm userId={session.userId} />
        ) : (
          <CompanyProfileForm userId={session.userId} teamSize={0} />
        )}
      </div>
    </div>
  )
}
