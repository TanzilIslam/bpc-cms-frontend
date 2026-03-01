import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCertificateVerification } from "@/hooks/useCertificateVerification"
import { formatDate } from "@/lib/formatters"

function decodeCodeParam(value: string | undefined): string {
  if (!value) {
    return ""
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function CertificateVerificationPage() {
  const params = useParams()
  const navigate = useNavigate()
  const routeCode = useMemo(() => decodeCodeParam(params.code), [params.code])
  const [code, setCode] = useState(() => routeCode)
  const { certificate, isLoading, error, verify, clear } = useCertificateVerification()

  useEffect(() => {
    if (!routeCode) {
      clear()
      return
    }

    void verify(routeCode)
  }, [clear, routeCode, verify])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedCode = code.trim()
    if (!normalizedCode) {
      navigate("/verify-certificate", { replace: routeCode.length > 0 })
      return
    }

    if (normalizedCode === routeCode) {
      void verify(normalizedCode)
      return
    }

    navigate(`/verify-certificate/${encodeURIComponent(normalizedCode)}`)
  }

  return (
    <section className="mx-auto grid max-w-3xl gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Certificate Verification</h1>
        <p className="text-muted-foreground">
          Enter a certificate code to verify authenticity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_auto]">
        <Input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="e.g. BPC-BWD-2026-001"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {certificate ? (
        <article className="space-y-4 rounded-lg border p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Verification Result</h2>
            <Badge variant={certificate.isVerified ? "default" : "destructive"}>
              {certificate.isVerified ? "Verified" : "Invalid"}
            </Badge>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Certificate Code
              </dt>
              <dd className="text-sm font-medium">{certificate.certificateCode}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Student</dt>
              <dd className="text-sm font-medium">{certificate.studentName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Course</dt>
              <dd className="text-sm font-medium">{certificate.courseTitle}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Grade</dt>
              <dd className="text-sm font-medium">{certificate.grade}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Issue Date</dt>
                <dd className="text-sm font-medium">{formatDate(certificate.issueDate)}</dd>
            </div>
          </dl>

          {certificate.skillsEarned.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Skills Earned
              </p>
              <div className="flex flex-wrap gap-2">
                {certificate.skillsEarned.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </article>
      ) : routeCode.length > 0 && !isLoading && !error ? (
        <p className="text-sm text-muted-foreground">
          No certificate data found for this code.
        </p>
      ) : null}
    </section>
  )
}
