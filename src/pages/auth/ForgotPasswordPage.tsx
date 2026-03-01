import { type FormEvent, useState } from "react"
import { Link } from "react-router-dom"

import { authApi } from "@/api/auth.api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSuccess(false)
    setIsSubmitting(true)

    try {
      await authApi.forgotPassword({ email })
      setIsSuccess(true)
    } catch {
      setError("Could not send reset request. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-lg border bg-background p-6">
      <h1 className="text-xl font-semibold">Forgot Password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your account email and we will send reset instructions.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="forgot-email">Email</Label>
          <Input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {isSuccess ? (
          <p className="text-sm text-green-600">
            Reset instructions sent if this email exists.
          </p>
        ) : null}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        Back to{" "}
        <Link className="text-primary hover:underline" to="/auth/login">
          Sign in
        </Link>
      </p>
    </section>
  )
}
