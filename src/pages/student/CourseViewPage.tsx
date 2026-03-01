import { Link, useParams } from "react-router-dom"

import {
  EmptyStatePanel,
  InlineErrorMessage,
  PageErrorState,
  PageLoadingState,
} from "@/components/shared/AsyncStates"
import { AdminDetailRow } from "@/components/shared/AdminDetailRow"
import { AdminSection } from "@/components/shared/AdminSection"
import { PageHeader } from "@/components/shared/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAssignments } from "@/hooks/useAssignments"
import { useEnrollments } from "@/hooks/useEnrollments"
import { formatMoney } from "@/lib/formatters"

export function CourseViewPage() {
  const params = useParams()
  const enrollmentId = params.id ?? ""
  const { enrollments, isLoading, error, reload } = useEnrollments()
  const {
    assignments,
    isLoading: isAssignmentsLoading,
    error: assignmentsError,
    reload: reloadAssignments,
  } = useAssignments()

  const enrollment =
    enrollments.find(
      (item) => item.id === enrollmentId || item.courseId === enrollmentId
    ) ?? null

  if (isLoading) {
    return <PageLoadingState message="Loading course view..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  if (!enrollment) {
    return (
      <EmptyStatePanel
        title="Enrollment not found"
        description="Enrollment not found for this course view."
        action={
          <Button asChild variant="outline" size="sm">
            <Link to="/student/courses">Back to My Courses</Link>
          </Button>
        }
      />
    )
  }

  const pendingAssignments = assignments.filter(
    (assignment) =>
      assignment.status === "NOT_SUBMITTED" || assignment.status === "REVISION_NEEDED"
  )
  const recentAssignments = assignments.slice(0, 5)

  return (
    <section className="space-y-5">
      <PageHeader
        title={enrollment.courseTitle}
        description={`Batch: ${enrollment.batchName}`}
        actions={
          <>
            <Badge variant="outline">{enrollment.enrollmentStatus}</Badge>
            <Badge>{enrollment.paymentStatus}</Badge>
          </>
        }
      />

      <AdminSection title="Course Progress">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(enrollment.progressPercentage)}%</span>
        </div>
        <Progress value={Math.max(0, Math.min(100, enrollment.progressPercentage))} />
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">
            Paid {formatMoney(enrollment.amountPaid)} / {formatMoney(enrollment.totalFee)}
          </span>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/student/assignments">Open Assignments</Link>
            </Button>
            {enrollment.courseSlug ? (
              <Button asChild variant="ghost" size="sm">
                <Link to={`/courses/${enrollment.courseSlug}`}>Public Course Page</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </AdminSection>

      <AdminSection
        title="Assignments Snapshot"
        action={<Badge variant="secondary">{pendingAssignments.length} Pending</Badge>}
      >

        {isAssignmentsLoading ? (
          <p className="text-sm text-muted-foreground">Loading assignments...</p>
        ) : assignmentsError ? (
          <InlineErrorMessage
            message={assignmentsError}
            action={
              <Button variant="outline" size="sm" onClick={() => void reloadAssignments()}>
                Retry Assignments
              </Button>
            }
          />
        ) : recentAssignments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No assignments found yet.</p>
        ) : (
          <div className="grid gap-2">
            {recentAssignments.map((assignment) => (
              <AdminDetailRow
                key={assignment.id}
                title={assignment.title}
                subtitle={assignment.assignmentType}
                value={<Badge variant="outline">{assignment.status}</Badge>}
              />
            ))}
          </div>
        )}
      </AdminSection>
    </section>
  )
}
