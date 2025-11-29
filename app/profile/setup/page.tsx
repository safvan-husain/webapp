import { redirect } from 'next/navigation'
import SeekerProfileForm from './seeker-form'
import CompanyProfileForm from './company-form'

export default async function ProfileSetupPage() {
  // TODO: Implement session management
  // For now, show a demo page
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
          <p className="font-semibold">Demo Mode</p>
          <p className="text-sm">Session management not yet implemented. This is a preview of the profile setup flow.</p>
        </div>

        <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-gray-600 mb-8">
          Help us understand you better to find the perfect matches
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Job Seeker Profile</h2>
            <SeekerProfileForm userId="demo-seeker-id" />
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
            <CompanyProfileForm userId="demo-company-id" teamSize={0} />
          </div>
        </div>
      </div>
    </div>
  )
}
