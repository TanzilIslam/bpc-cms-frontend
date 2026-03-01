import { Link } from "react-router-dom"

import { EmptyStatePanel, PageErrorState, PageLoadingState } from "@/components/shared/AsyncStates"
import { PageHeader } from "@/components/shared/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMyCertificate } from "@/hooks/useMyCertificate"
import { formatDate } from "@/lib/formatters"

export function MyCertificatePage() {
  const { certificate, isLoading, error, reload } = useMyCertificate()

  if (isLoading) {
    return <PageLoadingState message="Loading certificate..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  if (!certificate) {
    return (
      <div className="space-y-3">
        <PageHeader title="My Certificate" />
        <EmptyStatePanel
          title="Certificate not available yet"
          description="Your certificate will appear here once your enrollment is marked completed."
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/student/progress">View My Progress</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <section className="space-y-5">
      <PageHeader
        title="My Certificate"
        actions={
          <Badge variant={certificate.isVerified ? "default" : "secondary"}>
            {certificate.isVerified ? "Verified" : "Unverified"}
          </Badge>
        }
      />

      <article className="space-y-4 rounded-lg border p-5">
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
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Skills Earned</p>
            <div className="flex flex-wrap gap-2">
              {certificate.skillsEarned.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/verify-certificate/${encodeURIComponent(certificate.certificateCode)}`}>
              Verify Publicly
            </Link>
          </Button>
          {certificate.verificationLink ? (
            <Button asChild variant="outline" size="sm">
              <a href={certificate.verificationLink} target="_blank" rel="noreferrer">
                Open Verification Link
              </a>
            </Button>
          ) : null}
          {certificate.pdfPath ? (
            <Button asChild size="sm">
              <a href={certificate.pdfPath} target="_blank" rel="noreferrer">
                Download PDF
              </a>
            </Button>
          ) : null}
        </div>
      </article>
    </section>
  )
}
