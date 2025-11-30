import { getUserWithProfile } from '@/lib/dal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UserType } from '@prisma/client'

export default async function ProfilePage() {
  const user = await getUserWithProfile()

  if (!user) {
    return null
  }

  const profile = user.userType === UserType.SEEKER ? user.seekerProfile : user.companyProfile

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-semibold mb-6 tracking-tight">Profile</h1>

          {/* User Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="text-base font-medium">{user.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-base font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User Type</p>
                <p className="text-base font-medium">{user.userType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Created</p>
                <p className="text-base font-medium">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="text-base font-medium">
                  {user.isActive ? (
                    <span className="text-success">Active</span>
                  ) : (
                    <span className="text-destructive">Inactive</span>
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Profile-specific Information */}
          {profile && (
            <>
              <div className="border-t border-border my-6"></div>
              
              {user.userType === UserType.SEEKER && user.seekerProfile && (
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Seeker Profile</h2>
                  
                  <div className="space-y-6">
                    {/* Skills */}
                    {user.seekerProfile.skills && Array.isArray(user.seekerProfile.skills) && user.seekerProfile.skills.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {user.seekerProfile.skills.map((skill: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                            >
                              {typeof skill === 'string' ? skill : skill.name || 'N/A'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Job Type */}
                    {user.seekerProfile.jobType && user.seekerProfile.jobType.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Job Type Preferences</p>
                        <div className="flex flex-wrap gap-2">
                          {user.seekerProfile.jobType.map((type: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Location & Remote Preference */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.seekerProfile.locationPreference && (
                        <div>
                          <p className="text-sm text-muted-foreground">Location Preference</p>
                          <p className="text-base font-medium">{user.seekerProfile.locationPreference}</p>
                        </div>
                      )}
                      {user.seekerProfile.remotePreference && (
                        <div>
                          <p className="text-sm text-muted-foreground">Remote Preference</p>
                          <p className="text-base font-medium">{user.seekerProfile.remotePreference}</p>
                        </div>
                      )}
                    </div>

                    {/* Vision & Goals */}
                    {user.seekerProfile.vision && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Vision</p>
                        <p className="text-base">{user.seekerProfile.vision}</p>
                      </div>
                    )}

                    {user.seekerProfile.longTermGoals && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Long-term Goals</p>
                        <p className="text-base">{user.seekerProfile.longTermGoals}</p>
                      </div>
                    )}

                    {/* Work History */}
                    {user.seekerProfile.workHistory && Array.isArray(user.seekerProfile.workHistory) && user.seekerProfile.workHistory.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">Work History</p>
                        <div className="space-y-3">
                          {user.seekerProfile.workHistory.map((work: any, idx: number) => (
                            <div key={idx} className="p-4 bg-muted rounded-lg">
                              <p className="font-medium">{work.role || 'N/A'}</p>
                              <p className="text-sm text-muted-foreground">{work.company || 'N/A'}</p>
                              {work.duration && <p className="text-sm text-muted-foreground">{work.duration}</p>}
                              {work.description && <p className="text-sm mt-2">{work.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {user.seekerProfile.projects && Array.isArray(user.seekerProfile.projects) && user.seekerProfile.projects.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">Projects</p>
                        <div className="space-y-3">
                          {user.seekerProfile.projects.map((project: any, idx: number) => (
                            <div key={idx} className="p-4 bg-muted rounded-lg">
                              <p className="font-medium">{project.name || 'N/A'}</p>
                              {project.role && <p className="text-sm text-muted-foreground">{project.role}</p>}
                              {project.description && <p className="text-sm mt-2">{project.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {user.userType === UserType.COMPANY && user.companyProfile && (
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Company Profile</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Company Name</p>
                        <p className="text-base font-medium">{user.companyProfile.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Company Type</p>
                        <p className="text-base font-medium">{user.companyProfile.companyType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Industry</p>
                        <p className="text-base font-medium">{user.companyProfile.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Team Size</p>
                        <p className="text-base font-medium">{user.companyProfile.teamSize} employees</p>
                      </div>
                      {user.companyProfile.website && (
                        <div>
                          <p className="text-sm text-muted-foreground">Website</p>
                          <a
                            href={user.companyProfile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-medium text-primary hover:underline"
                          >
                            {user.companyProfile.website}
                          </a>
                        </div>
                      )}
                      {user.companyProfile.workModel && (
                        <div>
                          <p className="text-sm text-muted-foreground">Work Model</p>
                          <p className="text-base font-medium">{user.companyProfile.workModel}</p>
                        </div>
                      )}
                    </div>

                    {user.companyProfile.productService && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Product/Service</p>
                        <p className="text-base">{user.companyProfile.productService}</p>
                      </div>
                    )}

                    {user.companyProfile.companyOverview && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Company Overview</p>
                        <p className="text-base">{user.companyProfile.companyOverview}</p>
                      </div>
                    )}

                    {user.companyProfile.workCulture && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Work Culture</p>
                        <p className="text-base">{user.companyProfile.workCulture}</p>
                      </div>
                    )}

                    {user.companyProfile.teamStructure && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Team Structure</p>
                        <p className="text-base">{user.companyProfile.teamStructure}</p>
                      </div>
                    )}

                    {user.companyProfile.expectations && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Expectations</p>
                        <p className="text-base">{user.companyProfile.expectations}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </>
          )}

          {!profile && (
            <div className="border-t border-border pt-6">
              <p className="text-muted-foreground">No profile information available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
