import { Link } from "react-router-dom"

import { MetricCard } from "@/components/shared/MetricCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { useTABatches } from "@/hooks/useTABatches"
import { useTAGrading } from "@/hooks/useTAGrading"

export function TADashboardPage() {
  const { batches, isLoading: batchesLoading } = useTABatches()
  const { submissions, isLoading: submissionsLoading } = useTAGrading()

  const ongoingBatches = batches.filter((batch) => batch.status === "ONGOING").length
  const totalStudents = batches.reduce((sum, batch) => sum + batch.studentCount, 0)
  const pendingGrading = submissions.filter((item) => item.status === "SUBMITTED").length

  const metrics = [
    { label: "Assigned Batches", value: batchesLoading ? "-" : batches.length },
    { label: "Ongoing Batches", value: batchesLoading ? "-" : ongoingBatches },
    { label: "Students Covered", value: batchesLoading ? "-" : totalStudents },
    { label: "Pending Grading", value: submissionsLoading ? "-" : pendingGrading },
  ]

  return (
    <section className="space-y-6">
      <PageHeader
        title="TA Dashboard"
        description="Manage your assigned batches, attendance, and assignment grading."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/ta/batches">Open My Batches</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/ta/attendance">Mark Attendance</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/ta/progress">View Student Progress</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/ta/grading">Go to Grading</Link>
        </Button>
      </div>
    </section>
  )
}
