import { type FormEvent, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { authApi } from "@/api/auth.api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getFirstValidationError, resetPasswordFormSchema } from "@/lib/validation/auth"

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const params = useParams()
  const token = params.token ?? ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)

    const parsed = resetPasswordFormSchema.safeParse({
      token,
      password,
      confirmPassword,
    })
    if (!parsed.success) {
      setError(getFirstValidationError(parsed.error))
      return
    }

    setIsSubmitting(true)

    try {
      const result = await authApi.resetPassword({
        token: parsed.data.token,
        newPassword: parsed.data.password,
      })
      setSuccessMessage(result.message)
      navigate("/auth/login", { replace: true })
    } catch {
      setError("Could not reset password. Your token may be invalid or expired.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-lg border bg-background p-6">
      <h1 className="text-xl font-semibold">Reset Password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Set a new password for your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirm-new-password">Confirm New Password</Label>
          <Input
            id="confirm-new-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {successMessage ? <p className="text-sm text-green-600">{successMessage}</p> : null}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Password"}
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
