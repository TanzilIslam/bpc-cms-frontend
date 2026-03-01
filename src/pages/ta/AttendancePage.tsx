import { useEffect, useMemo, useState } from "react"

import {
  EmptyStatePanel,
  InlineErrorMessage,
  PageErrorState,
  PageLoadingState,
} from "@/components/shared/AsyncStates"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTAAttendance } from "@/hooks/useTAAttendance"
import { useTABatches } from "@/hooks/useTABatches"
import type { AttendanceStatus } from "@/types/ta"

const attendanceOptions: AttendanceStatus[] = ["PRESENT", "ABSENT", "LATE", "EXCUSED"]

type StatusMap = Record<string, AttendanceStatus>
type NotesMap = Record<string, string>

function todayValue(): string {
  return new Date().toISOString().slice(0, 10)
}

export function TAAttendancePage() {
  const { batches, studentsByBatch, isLoading, error, reload, loadStudents, loadingBatchId } =
    useTABatches()
  const { isSubmitting, error: submitError, submitAttendance } = useTAAttendance()

  const [batchId, setBatchId] = useState("")
  const [classDate, setClassDate] = useState(todayValue())
  const [classTopic, setClassTopic] = useState("")
  const [statusMap, setStatusMap] = useState<StatusMap>({})
  const [notesMap, setNotesMap] = useState<NotesMap>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const activeBatchId = batchId || batches[0]?.id || ""

  useEffect(() => {
    if (activeBatchId) {
      void loadStudents(activeBatchId)
    }
  }, [activeBatchId, loadStudents])

  const students = useMemo(() => {
    return activeBatchId ? studentsByBatch[activeBatchId] ?? [] : []
  }, [activeBatchId, studentsByBatch])

  async function handleSubmitAttendance() {
    if (!activeBatchId) {
      return
    }

    setSuccessMessage(null)

    await submitAttendance({
      batchId: activeBatchId,
      classDate,
      classTopic,
      records: students.map((student) => ({
        studentId: student.id,
        status: statusMap[student.id] ?? "PRESENT",
        notes: notesMap[student.id] || undefined,
      })),
    })

    setSuccessMessage("Attendance submitted successfully.")
  }

  if (isLoading) {
    return <PageLoadingState message="Loading attendance workspace..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  if (batches.length === 0) {
    return (
      <div className="space-y-3">
        <PageHeader title="Attendance" />
        <EmptyStatePanel
          title="No assigned batches"
          description="When a batch is assigned to you, you can mark attendance from this page."
        />
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <PageHeader title="Attendance" />

      <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-3">
        <select
          value={activeBatchId}
          onChange={(event) => setBatchId(event.target.value)}
          aria-label="Select batch for attendance"
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.batchName}
            </option>
          ))}
        </select>
        <Input
          type="date"
          aria-label="Attendance class date"
          value={classDate}
          onChange={(event) => setClassDate(event.target.value)}
        />
        <Input
          placeholder="Class topic"
          aria-label="Attendance class topic"
          value={classTopic}
          onChange={(event) => setClassTopic(event.target.value)}
        />
      </div>

      {loadingBatchId === activeBatchId ? (
        <p className="text-sm text-muted-foreground">Loading batch students...</p>
      ) : students.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No students found in selected batch.
        </p>
      ) : (
        <div className="space-y-2">
          {students.map((student) => (
            <article
              key={student.id}
              className="grid gap-2 rounded-lg border p-3 md:grid-cols-[1fr_160px_1fr]"
            >
              <div>
                <p className="font-medium">{student.fullName}</p>
                <p className="text-xs text-muted-foreground">{student.email}</p>
              </div>
              <select
                value={statusMap[student.id] ?? "PRESENT"}
                onChange={(event) =>
                  setStatusMap((prev) => ({
                    ...prev,
                    [student.id]: event.target.value as AttendanceStatus,
                  }))
                }
                aria-label={`Attendance status for ${student.fullName}`}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                {attendanceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Notes (optional)"
                aria-label={`Attendance notes for ${student.fullName}`}
                value={notesMap[student.id] ?? ""}
                onChange={(event) =>
                  setNotesMap((prev) => ({
                    ...prev,
                    [student.id]: event.target.value,
                  }))
                }
              />
            </article>
          ))}
        </div>
      )}

      <InlineErrorMessage message={submitError} />
      {successMessage ? <p className="text-sm text-green-600">{successMessage}</p> : null}

      <div>
        <Button
          onClick={() => void handleSubmitAttendance()}
          disabled={isSubmitting || !activeBatchId || students.length === 0}
        >
          {isSubmitting ? "Submitting..." : "Submit Attendance"}
        </Button>
      </div>
    </section>
  )
}
