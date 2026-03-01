import { useState } from "react"

import { EmptyStatePanel, PageErrorState, PageLoadingState } from "@/components/shared/AsyncStates"
import { AdminListCard } from "@/components/shared/AdminListCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTABatches } from "@/hooks/useTABatches"

export function TAMyBatchesPage() {
  const { batches, studentsByBatch, isLoading, error, reload, loadStudents, loadingBatchId } =
    useTABatches()
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null)

  async function handleToggleStudents(batchId: string) {
    if (expandedBatchId === batchId) {
      setExpandedBatchId(null)
      return
    }

    setExpandedBatchId(batchId)

    if (!studentsByBatch[batchId]) {
      await loadStudents(batchId)
    }
  }

  if (isLoading) {
    return <PageLoadingState message="Loading assigned batches..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  if (batches.length === 0) {
    return (
      <div className="space-y-3">
        <PageHeader title="My Batches" />
        <EmptyStatePanel
          title="No assigned batches"
          description="Batches assigned to your TA account will show up here."
        />
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <PageHeader title="My Batches" />
      <div className="grid gap-4">
        {batches.map((batch) => {
          const students = studentsByBatch[batch.id] ?? []
          const isExpanded = expandedBatchId === batch.id

          return (
            <AdminListCard
              key={batch.id}
              title={batch.batchName}
              subtitle={batch.courseTitle}
              headerRight={
                <>
                  <Badge variant="secondary">{batch.status}</Badge>
                  <Badge variant="outline">{batch.studentCount} students</Badge>
                </>
              }
              body={
                <p className="text-sm text-muted-foreground">
                  Code: {batch.batchCode} | Schedule: {batch.schedule}
                </p>
              }
              meta={
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleToggleStudents(batch.id)}
                    disabled={loadingBatchId === batch.id}
                  >
                    {isExpanded ? "Hide Students" : "View Students"}
                  </Button>

                  {isExpanded ? (
                    <div className="mt-3 space-y-2 rounded-md border p-3">
                      {loadingBatchId === batch.id ? (
                        <p className="text-sm text-muted-foreground">Loading students...</p>
                      ) : students.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No student records found for this batch.
                        </p>
                      ) : (
                        students.map((student) => (
                          <div
                            key={student.id}
                            className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 text-sm last:border-none last:pb-0"
                          >
                            <div>
                              <p className="font-medium">{student.fullName}</p>
                              <p className="text-muted-foreground">
                                {student.email} | {student.phone}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {Math.round(student.progressPercentage)}% progress
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  ) : null}
                </>
              }
            />
          )
        })}
      </div>
    </section>
  )
}
