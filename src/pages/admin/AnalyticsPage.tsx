import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  InlineErrorMessage,
  PageErrorState,
  PageLoadingState,
} from "@/components/shared/AsyncStates"
import { AdminPageHeader } from "@/components/shared/AdminPageHeader"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAdminCourses } from "@/hooks/useAdminCourses"
import { useAdminFinancialGoals } from "@/hooks/useAdminFinancialGoals"
import { useAdminFinancialSummary } from "@/hooks/useAdminFinancialSummary"
import { useAdminOverview } from "@/hooks/useAdminOverview"
import { useAdminPayments } from "@/hooks/useAdminPayments"
import { useAdminStudents } from "@/hooks/useAdminStudents"
import { formatMoney } from "@/lib/formatters"
import type { AdminFinancialGoal } from "@/types/admin"

function toMonthKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

function toMonthLabel(key: string): string {
  const [yearText, monthText] = key.split("-")
  const year = Number(yearText)
  const month = Number(monthText)

  if (Number.isNaN(year) || Number.isNaN(month)) {
    return key
  }

  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

function getGoalProgress(goal: AdminFinancialGoal): number {
  if (goal.targetAmount <= 0) {
    return 0
  }

  return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
}

const paymentStatusColors = ["#2563EB", "#10B981", "#F59E0B", "#EF4444"]
const pieColors = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

export function AdminAnalyticsPage() {
  const {
    overview,
    isLoading: isOverviewLoading,
    error: overviewError,
    reload: reloadOverview,
  } = useAdminOverview()
  const {
    summary,
    isLoading: isSummaryLoading,
    error: summaryError,
    reload: reloadSummary,
  } = useAdminFinancialSummary()
  const {
    students,
    isLoading: isStudentsLoading,
    error: studentsError,
    reload: reloadStudents,
  } = useAdminStudents()
  const {
    payments,
    isLoading: isPaymentsLoading,
    error: paymentsError,
    reload: reloadPayments,
  } = useAdminPayments()
  const {
    courses,
    isLoading: isCoursesLoading,
    error: coursesError,
    reload: reloadCourses,
  } = useAdminCourses()
  const {
    goals,
    isLoading: isGoalsLoading,
    error: goalsError,
    reload: reloadGoals,
  } = useAdminFinancialGoals()

  const isLoading =
    isOverviewLoading ||
    isSummaryLoading ||
    isStudentsLoading ||
    isPaymentsLoading ||
    isCoursesLoading ||
    isGoalsLoading

  const error =
    overviewError ??
    summaryError ??
    studentsError ??
    paymentsError ??
    coursesError ??
    null

  const revenueTrendData = useMemo(() => {
    const monthlyTotals = new Map<string, number>()

    for (const payment of payments) {
      if (payment.status !== "CONFIRMED" || !payment.paymentDate) {
        continue
      }

      const date = new Date(payment.paymentDate)
      if (Number.isNaN(date.getTime())) {
        continue
      }

      const key = toMonthKey(date)
      monthlyTotals.set(key, (monthlyTotals.get(key) ?? 0) + payment.amount)
    }

    return [...monthlyTotals.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, revenue]) => ({
        month: toMonthLabel(key),
        revenue,
      }))
  }, [payments])

  const paymentStatusData = useMemo(() => {
    const counts = new Map<string, number>()

    for (const payment of payments) {
      counts.set(payment.status, (counts.get(payment.status) ?? 0) + 1)
    }

    return [...counts.entries()].map(([status, count]) => ({
      status,
      count,
    }))
  }, [payments])

  const courseDifficultyData = useMemo(() => {
    const counts = new Map<string, number>()

    for (const course of courses) {
      counts.set(course.difficultyLevel, (counts.get(course.difficultyLevel) ?? 0) + 1)
    }

    return [...counts.entries()].map(([name, value]) => ({ name, value }))
  }, [courses])

  const studentStatusData = useMemo(() => {
    const counts = new Map<string, number>()

    for (const student of students) {
      counts.set(student.status, (counts.get(student.status) ?? 0) + 1)
    }

    return [...counts.entries()].map(([name, value]) => ({ name, value }))
  }, [students])

  const publishedCourses = useMemo(
    () => courses.filter((course) => course.isPublished).length,
    [courses]
  )
  const activeGoals = useMemo(
    () => goals.filter((goal) => goal.status === "ACTIVE").length,
    [goals]
  )
  const achievedGoals = useMemo(
    () => goals.filter((goal) => goal.status === "ACHIEVED").length,
    [goals]
  )
  const goalProgressData = useMemo(
    () =>
      goals.map((goal) => ({
        goalName:
          goal.goalName.length > 22 ? `${goal.goalName.slice(0, 22)}...` : goal.goalName,
        progress: getGoalProgress(goal),
        status: goal.status,
      })),
    [goals]
  )

  async function handleReloadAll() {
    await Promise.all([
      reloadOverview(),
      reloadSummary(),
      reloadStudents(),
      reloadPayments(),
      reloadCourses(),
      reloadGoals(),
    ])
  }

  if (isLoading) {
    return <PageLoadingState message="Loading analytics..." />
  }

  if (error || !overview || !summary) {
    return (
      <PageErrorState
        message={error ?? "Failed to load analytics data."}
        onRetry={() => void handleReloadAll()}
      />
    )
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Analytics"
        description="Trends and distribution across students, courses, and payments."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <Card>
          <CardHeader>
            <CardDescription>Total Students</CardDescription>
            <CardTitle>{overview.totalStudents}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active Students</CardDescription>
            <CardTitle>{overview.activeStudents}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle>{formatMoney(summary.totalRevenue)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Published Courses</CardDescription>
            <CardTitle>{publishedCourses}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active Goals</CardDescription>
            <CardTitle>{goalsError ? "-" : activeGoals}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Achieved Goals</CardDescription>
            <CardTitle>{goalsError ? "-" : achievedGoals}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
            <CardDescription>Confirmed payments grouped by month.</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueTrendData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No confirmed payment trend data.</p>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatMoney(Number(value))} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563EB"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
            <CardDescription>All payments by current status.</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentStatusData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payment records available.</p>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count">
                      {paymentStatusData.map((entry, index) => (
                        <Cell
                          key={`payment-status-${entry.status}`}
                          fill={paymentStatusColors[index % paymentStatusColors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course Difficulty Mix</CardTitle>
            <CardDescription>How the catalog is distributed by difficulty.</CardDescription>
          </CardHeader>
          <CardContent>
            {courseDifficultyData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No course records available.</p>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={courseDifficultyData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {courseDifficultyData.map((entry, index) => (
                        <Cell
                          key={`course-difficulty-${entry.name}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Status Mix</CardTitle>
            <CardDescription>Distribution across active/inactive/suspended.</CardDescription>
          </CardHeader>
          <CardContent>
            {studentStatusData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No student records available.</p>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={studentStatusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {studentStatusData.map((entry, index) => (
                        <Cell
                          key={`student-status-${entry.name}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Savings Goal Progress</CardTitle>
          <CardDescription>
            Completion percentage for configured financial goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {goalsError ? (
            <InlineErrorMessage
              message={goalsError}
              action={
                <Button variant="outline" size="sm" onClick={() => void reloadGoals()}>
                  Retry Goal Load
                </Button>
              }
            />
          ) : goalProgressData.length === 0 ? (
            <p className="text-sm text-muted-foreground">No financial goals found.</p>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="goalName" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="progress">
                    {goalProgressData.map((entry, index) => (
                      <Cell
                        key={`goal-progress-${index}`}
                        fill={
                          entry.status === "ACHIEVED"
                            ? "#10B981"
                            : entry.status === "CANCELLED"
                              ? "#9CA3AF"
                              : "#2563EB"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
