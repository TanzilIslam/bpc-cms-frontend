import { type FormEvent, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { getFirstValidationError, loginFormSchema } from "@/lib/validation/auth"
import { getDefaultRouteForRole } from "@/lib/permissions"

export function LoginPage() {
  const navigate = useNavigate()
  const { user, login, isLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      navigate(getDefaultRouteForRole(user.role), { replace: true })
    }
  }, [navigate, user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const parsed = loginFormSchema.safeParse({ email, password })
    if (!parsed.success) {
      setError(getFirstValidationError(parsed.error))
      return
    }

    try {
      await login(parsed.data.email, parsed.data.password)
    } catch {
      setError("Login failed. Check your credentials and try again.")
    }
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-lg border bg-background p-6">
      <h1 className="text-xl font-semibold">Sign In</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Use your account to access student, TA, or admin dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <Link className="text-primary hover:underline" to="/auth/forgot-password">
          Forgot password?
        </Link>
        <Link className="text-primary hover:underline" to="/auth/register">
          Create account
        </Link>
      </div>
    </section>
  )
}
