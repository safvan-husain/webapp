import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/queries/auth.queries'
import { logoutAction } from '@/lib/actions/auth.actions'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user.fullName}!</h1>
              <p className="text-gray-600">User Type: {user.userType}</p>
              <p className="text-gray-600">Email: {user.email}</p>
            </div>
            <form action={logoutAction}>
              <button 
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </form>
          </div>
          
          <div className="border-t pt-6">
            {user.userType === 'COMPANY' ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Company Dashboard</h2>
                <p className="text-gray-600">Post jobs, manage applications, view candidates...</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Job Seeker Dashboard</h2>
                <p className="text-gray-600">Browse jobs, manage applications, update profile...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
