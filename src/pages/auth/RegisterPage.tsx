import { type FormEvent, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { getDefaultRouteForRole } from "@/lib/permissions"

export function RegisterPage() {
  const navigate = useNavigate()
  const { user, register, isLoading } = useAuth()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [laptopSpecs, setLaptopSpecs] = useState("")
  const [internetSpeed, setInternetSpeed] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      navigate(getDefaultRouteForRole(user.role), { replace: true })
    }
  }, [navigate, user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      await register({
        full_name: fullName,
        email,
        phone,
        password,
        laptop_specs: laptopSpecs || undefined,
        internet_speed: internetSpeed || undefined,
      })
    } catch {
      setError("Registration failed. Please check your data and try again.")
    }
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-lg border bg-background p-6">
      <h1 className="text-xl font-semibold">Create Student Account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Register to access course materials and assignments.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input
            id="full-name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+8801XXXXXXXXX"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="laptop-specs">Laptop Specs (optional)</Label>
          <Input
            id="laptop-specs"
            value={laptopSpecs}
            onChange={(event) => setLaptopSpecs(event.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="internet-speed">Internet Speed (optional)</Label>
          <Input
            id="internet-speed"
            value={internetSpeed}
            onChange={(event) => setInternetSpeed(event.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Register"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="text-primary hover:underline" to="/auth/login">
          Sign in
        </Link>
      </p>
    </section>
  )
}
