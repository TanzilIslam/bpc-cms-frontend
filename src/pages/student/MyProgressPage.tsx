import {
  InlineErrorMessage,
  PageErrorState,
  PageLoadingState,
} from "@/components/shared/AsyncStates"
import { MetricCard } from "@/components/shared/MetricCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAssignments } from "@/hooks/useAssignments"
import { useEnrollments } from "@/hooks/useEnrollments"
import { useStudentProgress } from "@/hooks/useStudentProgress"

export function MyProgressPage() {
  const { enrollments, isLoading, error, reload } = useEnrollments()
  const { progress, isLoading: isProgressLoading, error: progressError, reload: reloadProgress } = useStudentProgress()
  const {
    assignments,
    isLoading: isAssignmentsLoading,
    error: assignmentsError,
    reload: reloadAssignments,
  } = useAssignments()

  const averageProgress = Math.round(
    progress?.overallProgress ??
      (enrollments.length === 0
        ? 0
        : enrollments.reduce((sum, enrollment) => sum + enrollment.progressPercentage, 0) /
          enrollments.length)
  )

  const gradedAssignments = assignments.filter((assignment) => assignment.status === "GRADED")
  const pendingAssignments = assignments.filter(
    (assignment) =>
      assignment.status === "NOT_SUBMITTED" || assignment.status === "REVISION_NEEDED"
  )

  const metrics = [
    {
      label: "Overall Progress",
      value: (
        <>
          {averageProgress}%
          <Progress value={Math.max(0, Math.min(100, averageProgress))} className="mt-3" />
        </>
      ),
    },
    {
      label: "Graded Assignments",
      value: isAssignmentsLoading ? "-" : gradedAssignments.length,
    },
    {
      label: "Pending Assignments",
      value: isAssignmentsLoading ? "-" : pendingAssignments.length,
    },
  ]

  if (isLoading || isProgressLoading) {
    return <PageLoadingState message="Loading progress..." />
  }

  if (error || progressError) {
    return <PageErrorState
      message={error ?? progressError ?? "Failed to load progress."}
      onRetry={() => {
        void reload()
        void reloadProgress()
      }}
    />
  }

  return (
    <section className="space-y-5">
      <PageHeader
        title="My Progress"
        description="Track your overall and course-wise learning progress."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>

      <InlineErrorMessage
        message={assignmentsError}
        action={
          <Button variant="outline" size="sm" onClick={() => void reloadAssignments()}>
            Retry Assignments
          </Button>
        }
      />

      {enrollments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You are not enrolled in any course yet.
        </p>
      ) : (
        <div className="grid gap-3">
          {enrollments.map((enrollment) => (
            <article key={enrollment.id} className="space-y-2 rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-semibold">{enrollment.courseTitle}</h2>
                  <p className="text-xs text-muted-foreground">{enrollment.batchName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{enrollment.enrollmentStatus}</Badge>
                  <Badge variant="secondary">{Math.round(enrollment.progressPercentage)}%</Badge>
                </div>
              </div>
              <Progress value={Math.max(0, Math.min(100, enrollment.progressPercentage))} />
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
