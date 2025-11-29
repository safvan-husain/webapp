import { LoginForm } from '../components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold text-center mb-6 tracking-tight">Login</h1>
        <LoginForm />
      </div>
    </div>
  )
}
