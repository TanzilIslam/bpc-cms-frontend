import { Link } from "react-router-dom"

import { EmptyStatePanel, PageErrorState, PageLoadingState } from "@/components/shared/AsyncStates"
import { AdminListCard } from "@/components/shared/AdminListCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useEnrollments } from "@/hooks/useEnrollments"
import { formatMoney } from "@/lib/formatters"

export function MyCoursesPage() {
  const { enrollments, isLoading, error, reload } = useEnrollments()

  if (isLoading) {
    return <PageLoadingState message="Loading your courses..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  if (enrollments.length === 0) {
    return (
      <div className="space-y-3">
        <PageHeader title="My Courses" />
        <EmptyStatePanel
          title="No course enrollments yet"
          description="Once you enroll in a batch, your courses and progress will appear here."
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <PageHeader title="My Courses" />
      <div className="grid gap-4">
        {enrollments.map((enrollment) => (
          <AdminListCard
            key={enrollment.id}
            title={enrollment.courseTitle}
            subtitle={`Batch: ${enrollment.batchName}`}
            headerRight={
              <>
                <Badge variant="outline">{enrollment.enrollmentStatus}</Badge>
                <Badge>{enrollment.paymentStatus}</Badge>
              </>
            }
            body={
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {Math.round(enrollment.progressPercentage)}%
                  </span>
                </div>
                <Progress value={Math.max(0, Math.min(100, enrollment.progressPercentage))} />
              </div>
            }
            meta={
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <p className="text-muted-foreground">
                  Paid {formatMoney(enrollment.amountPaid)} / {formatMoney(enrollment.totalFee)}
                </p>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/student/courses/${enrollment.id}`}>Continue Learning</Link>
                  </Button>
                  {enrollment.courseSlug ? (
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/courses/${enrollment.courseSlug}`}>Public Details</Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            }
          />
        ))}
      </div>
    </section>
  )
}
