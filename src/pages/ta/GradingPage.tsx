import { useMemo, useState } from "react"

import {
  EmptyStatePanel,
  InlineErrorMessage,
  PageErrorState,
  PageLoadingState,
} from "@/components/shared/AsyncStates"
import { PageHeader } from "@/components/shared/PageHeader"
import { AdminSection } from "@/components/shared/AdminSection"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTAGrading } from "@/hooks/useTAGrading"
import { formatDate } from "@/lib/formatters"
import type { TASubmission } from "@/types/ta"

export function TAGradingPage() {
  const { submissions, isLoading, isGrading, error, reload, gradeAssignment } =
    useTAGrading()

  const [assignmentId, setAssignmentId] = useState("")
  const [submissionId, setSubmissionId] = useState("")
  const [studentId, setStudentId] = useState("")
  const [score, setScore] = useState("")
  const [status, setStatus] = useState<"GRADED" | "REVISION_NEEDED">("GRADED")
  const [feedback, setFeedback] = useState("")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const pendingSubmissions = useMemo(() => {
    return submissions.filter((submission) => submission.status === "SUBMITTED")
  }, [submissions])

  function fillFromSubmission(submission: TASubmission) {
    setAssignmentId(submission.assignmentId)
    setSubmissionId(submission.id)
    setStudentId(submission.studentId)
    setScore(submission.score !== null ? String(submission.score) : "")
    setFeedback(submission.feedback ?? "")
    setStatus(submission.status === "REVISION_NEEDED" ? "REVISION_NEEDED" : "GRADED")
  }

  async function handleGrade() {
    setSuccessMessage(null)
    setSubmitError(null)

    if (!assignmentId || score.trim().length === 0) {
      setSubmitError("Assignment ID and score are required.")
      return
    }

    const numericScore = Number(score)
    if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      setSubmitError("Score must be a number between 0 and 100.")
      return
    }

    try {
      await gradeAssignment(assignmentId, {
        submissionId: submissionId || undefined,
        studentId: studentId || undefined,
        score: numericScore,
        feedback: feedback || undefined,
        status,
      })

      setSuccessMessage("Submission graded successfully.")
      setAssignmentId("")
      setSubmissionId("")
      setStudentId("")
      setScore("")
      setFeedback("")
      setStatus("GRADED")
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Failed to submit grade."
      setSubmitError(message)
    }
  }

  if (isLoading) {
    return <PageLoadingState message="Loading grading queue..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  return (
    <section className="space-y-5">
      <PageHeader title="Grading" />

      <AdminSection title="Pending Submissions">
        {pendingSubmissions.length === 0 ? (
          <EmptyStatePanel
            title="No pending submissions"
            description="You are all caught up. New submissions will appear here."
            className="p-4 md:p-6"
          />
        ) : (
          <div className="grid gap-2">
            {pendingSubmissions.map((submission) => (
              <article
                key={submission.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{submission.assignmentTitle}</p>
                  <p className="text-muted-foreground">
                    {submission.studentName} | Submitted: {formatDate(submission.submittedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{submission.status}</Badge>
                  <Button variant="outline" size="sm" onClick={() => fillFromSubmission(submission)}>
                    Use in Form
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminSection>

      <AdminSection title="Grade Submission">
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Assignment ID"
            aria-label="Assignment ID"
            value={assignmentId}
            onChange={(event) => setAssignmentId(event.target.value)}
          />
          <Input
            placeholder="Submission ID (optional)"
            aria-label="Submission ID"
            value={submissionId}
            onChange={(event) => setSubmissionId(event.target.value)}
          />
          <Input
            placeholder="Student ID (optional)"
            aria-label="Student ID"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
          />
          <Input
            placeholder="Score (0-100)"
            aria-label="Score from 0 to 100"
            value={score}
            onChange={(event) => setScore(event.target.value)}
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as "GRADED" | "REVISION_NEEDED")}
          aria-label="Submission status"
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="GRADED">GRADED</option>
          <option value="REVISION_NEEDED">REVISION_NEEDED</option>
        </select>

        <Textarea
          rows={4}
          placeholder="Feedback for student"
          aria-label="Feedback for student"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
        />

        <InlineErrorMessage message={submitError} />
        {successMessage ? <p className="text-sm text-green-600">{successMessage}</p> : null}

        <Button onClick={() => void handleGrade()} disabled={isGrading}>
          {isGrading ? "Submitting..." : "Submit Grade"}
        </Button>
      </AdminSection>
    </section>
  )
}
