import { Link } from "react-router-dom"

import { MetricCard } from "@/components/shared/MetricCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { useAssignments } from "@/hooks/useAssignments"
import { useEnrollments } from "@/hooks/useEnrollments"

export function StudentDashboardPage() {
  const { enrollments, isLoading: enrollmentsLoading } = useEnrollments()
  const { assignments, isLoading: assignmentsLoading } = useAssignments()

  const totalCourses = enrollments.length
  const activeCourses = enrollments.filter(
    (enrollment) => enrollment.enrollmentStatus === "ACTIVE"
  ).length
  const averageProgress =
    enrollments.length === 0
      ? 0
      : Math.round(
          enrollments.reduce((sum, enrollment) => sum + enrollment.progressPercentage, 0) /
            enrollments.length
        )
  const pendingAssignments = assignments.filter(
    (assignment) =>
      assignment.status === "NOT_SUBMITTED" || assignment.status === "REVISION_NEEDED"
  ).length

  const metrics = [
    { label: "Total Courses", value: enrollmentsLoading ? "-" : totalCourses },
    { label: "Active Courses", value: enrollmentsLoading ? "-" : activeCourses },
    { label: "Average Progress", value: enrollmentsLoading ? "-" : `${averageProgress}%` },
    { label: "Pending Assignments", value: assignmentsLoading ? "-" : pendingAssignments },
  ]

  return (
    <section className="space-y-6">
      <PageHeader
        title="Student Dashboard"
        description="Overview of your courses, progress, and assignment workload."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/student/courses">Open My Courses</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/student/assignments">Open Assignments</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/student/progress">View Progress</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/student/payments">View Payments</Link>
        </Button>
      </div>
    </section>
  )
}
