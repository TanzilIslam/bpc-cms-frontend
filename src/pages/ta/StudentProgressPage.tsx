import { useEffect, useMemo, useState } from "react"

import { EmptyStatePanel, PageErrorState, PageLoadingState } from "@/components/shared/AsyncStates"
import { MetricCard } from "@/components/shared/MetricCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useTABatches } from "@/hooks/useTABatches"
import type { TABatchStudent } from "@/types/ta"

type StudentProgressFilter = "ALL" | "AT_RISK" | "ON_TRACK" | "COMPLETED"

function getProgressBand(progress: number): StudentProgressFilter {
  if (progress < 50) {
    return "AT_RISK"
  }

  if (progress >= 80) {
    return "COMPLETED"
  }

  return "ON_TRACK"
}

function getProgressBadgeVariant(
  band: StudentProgressFilter
): "destructive" | "default" | "secondary" {
  if (band === "AT_RISK") {
    return "destructive"
  }

  if (band === "COMPLETED") {
    return "default"
  }

  return "secondary"
}

export function TAStudentProgressPage() {
  const { batches, studentsByBatch, isLoading, error, reload, loadStudents, loadingBatchId } =
    useTABatches()
  const [selectedBatchId, setSelectedBatchId] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<StudentProgressFilter>("ALL")

  const activeBatchId = useMemo(() => {
    if (selectedBatchId && batches.some((batch) => batch.id === selectedBatchId)) {
      return selectedBatchId
    }

    return batches[0]?.id ?? ""
  }, [batches, selectedBatchId])

  useEffect(() => {
    if (!activeBatchId || studentsByBatch[activeBatchId]) {
      return
    }

    void loadStudents(activeBatchId)
  }, [activeBatchId, studentsByBatch, loadStudents])

  const selectedBatch = useMemo(
    () => batches.find((batch) => batch.id === activeBatchId) ?? null,
    [batches, activeBatchId]
  )

  const students = useMemo(() => {
    if (!activeBatchId) {
      return [] as TABatchStudent[]
    }

    return studentsByBatch[activeBatchId] ?? []
  }, [activeBatchId, studentsByBatch])

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return students.filter((student) => {
      const band = getProgressBand(student.progressPercentage)
      const matchesFilter = filter === "ALL" ? true : band === filter
      const matchesSearch =
        normalizedSearch.length === 0
          ? true
          : student.fullName.toLowerCase().includes(normalizedSearch) ||
            student.email.toLowerCase().includes(normalizedSearch) ||
            student.phone.toLowerCase().includes(normalizedSearch)

      return matchesFilter && matchesSearch
    })
  }, [students, filter, searchTerm])

  const summary = useMemo(() => {
    if (students.length === 0) {
      return {
        totalStudents: 0,
        averageProgress: 0,
        atRiskStudents: 0,
        completedStudents: 0,
      }
    }

    const totalProgress = students.reduce((sum, student) => sum + student.progressPercentage, 0)
    const atRiskStudents = students.filter(
      (student) => getProgressBand(student.progressPercentage) === "AT_RISK"
    ).length
    const completedStudents = students.filter(
      (student) => getProgressBand(student.progressPercentage) === "COMPLETED"
    ).length

    return {
      totalStudents: students.length,
      averageProgress: Math.round(totalProgress / students.length),
      atRiskStudents,
      completedStudents,
    }
  }, [students])

  const metrics = [
    { label: "Students", value: summary.totalStudents },
    { label: "Average Progress", value: `${summary.averageProgress}%` },
    { label: "At Risk (<50%)", value: summary.atRiskStudents },
    { label: "Strong Progress (80%+)", value: summary.completedStudents },
  ]

  if (isLoading) {
    return <PageLoadingState message="Loading student progress..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  if (batches.length === 0) {
    return (
      <div className="space-y-3">
        <PageHeader title="Student Progress" />
        <EmptyStatePanel
          title="No assigned batches"
          description="Student progress data will appear once you are assigned to a batch."
        />
      </div>
    )
  }

  return (
    <section className="space-y-5">
      <PageHeader
        title="Student Progress"
        description="Monitor individual progress and identify students who need support."
      />

      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>

      <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-[260px_1fr_200px]">
        <select
          value={activeBatchId}
          onChange={(event) => setSelectedBatchId(event.target.value)}
          aria-label="Select batch for student progress"
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.batchName} | {batch.courseTitle}
            </option>
          ))}
        </select>

        <Input
          placeholder="Search student by name/email/phone"
          aria-label="Search students"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as StudentProgressFilter)}
          aria-label="Filter students by progress band"
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="ALL">All Students</option>
          <option value="AT_RISK">At Risk</option>
          <option value="ON_TRACK">On Track</option>
          <option value="COMPLETED">Strong Progress</option>
        </select>
      </div>

      {selectedBatch ? (
        <p className="text-sm text-muted-foreground">
          Batch: {selectedBatch.batchName} ({selectedBatch.batchCode}) | Schedule:{" "}
          {selectedBatch.schedule}
        </p>
      ) : null}

      {activeBatchId && loadingBatchId === activeBatchId ? (
        <p className="text-sm text-muted-foreground">Loading batch students...</p>
      ) : filteredStudents.length === 0 ? (
        <EmptyStatePanel
          title="No students matched"
          description="Try changing the search term or progress filter."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setFilter("ALL")
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3">
          {filteredStudents.map((student) => (
            <StudentProgressCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </section>
  )
}

function StudentProgressCard({ student }: { student: TABatchStudent }) {
  const roundedProgress = Math.round(student.progressPercentage)
  const band = getProgressBand(roundedProgress)

  return (
    <article className="space-y-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold">{student.fullName}</h2>
          <p className="text-xs text-muted-foreground">
            {student.email} | {student.phone}
          </p>
        </div>
        <Badge variant={getProgressBadgeVariant(band)}>
          {band === "AT_RISK"
            ? "At Risk"
            : band === "COMPLETED"
              ? "Strong Progress"
              : "On Track"}
        </Badge>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{roundedProgress}%</span>
        </div>
        <Progress value={Math.max(0, Math.min(100, roundedProgress))} />
      </div>
    </article>
  )
}
