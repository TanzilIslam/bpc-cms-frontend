import { Link } from "react-router-dom"

import { PageErrorState, PageLoadingState } from "@/components/shared/AsyncStates"
import { AdminPageHeader } from "@/components/shared/AdminPageHeader"
import { MetricCard } from "@/components/shared/MetricCard"
import { Button } from "@/components/ui/button"
import { useAdminOverview } from "@/hooks/useAdminOverview"
import { formatMoney } from "@/lib/formatters"

export function AdminDashboardPage() {
  const { overview, isLoading, error, reload } = useAdminOverview()

  if (isLoading) {
    return <PageLoadingState message="Loading admin overview..." />
  }

  if (error || !overview) {
    return <PageErrorState message={error ?? "Failed to load overview."} onRetry={() => void reload()} />
  }

  const metrics = [
    { label: "Total Students", value: overview.totalStudents },
    { label: "Active Students", value: overview.activeStudents },
    { label: "Total Revenue", value: formatMoney(overview.totalRevenue) },
    { label: "Pending Payments", value: overview.pendingPayments },
  ]

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Admin Dashboard"
        description="Overview of students, revenue, and payment pipeline."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/students">Manage Students</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/courses">Manage Courses</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/payments">View Payments</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/announcements">Manage Announcements</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/testimonials">Manage Testimonials</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/analytics">View Analytics</Link>
        </Button>
      </div>
    </section>
  )
}
