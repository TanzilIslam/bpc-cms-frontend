import { useMemo, useState } from "react"

import {
  EmptyStatePanel,
  InlineErrorMessage,
  PageErrorState,
  PageLoadingState,
} from "@/components/shared/AsyncStates"
import { AdminFormError, AdminFormField, AdminFormGrid } from "@/components/shared/AdminForm"
import { AdminListCard } from "@/components/shared/AdminListCard"
import { AdminPageHeader } from "@/components/shared/AdminPageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAdminBatches } from "@/hooks/useAdminBatches"
import { useAdminCourses } from "@/hooks/useAdminCourses"
import { BATCH_STATUS_OPTIONS, NATIVE_SELECT_CLASS_NAME } from "@/lib/admin-options"
import { batchStatusBadgeVariant } from "@/lib/admin-badges"
import type { AdminBatch, AdminBatchStatus } from "@/types/admin"

type BatchFormState = {
  courseId: string
  batchName: string
  batchCode: string
  startDate: string
  endDate: string
  schedule: string
  maxStudents: string
  status: AdminBatchStatus
  isFree: boolean
}

const baseBatchForm: BatchFormState = {
  courseId: "",
  batchName: "",
  batchCode: "",
  startDate: "",
  endDate: "",
  schedule: "",
  maxStudents: "10",
  status: "UPCOMING",
  isFree: false,
}

function buildEmptyForm(defaultCourseId: string): BatchFormState {
  return {
    ...baseBatchForm,
    courseId: defaultCourseId,
  }
}

function formFromBatch(batch: AdminBatch): BatchFormState {
  return {
    ...baseBatchForm,
    courseId: batch.courseId,
    batchName: batch.batchName,
    batchCode: batch.batchCode,
    schedule: batch.schedule,
    maxStudents: String(batch.maxStudents || 10),
    status: batch.status,
  }
}

export function AdminBatchesPage() {
  const {
    batches,
    isLoading: isBatchesLoading,
    isMutating,
    error,
    actionError,
    reload,
    createBatch,
    updateBatch,
  } = useAdminBatches()
  const { courses, isLoading: isCoursesLoading } = useAdminCourses()

  const defaultCourseId = useMemo(() => courses[0]?.id ?? "", [courses])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null)
  const [form, setForm] = useState<BatchFormState>(() => buildEmptyForm(defaultCourseId))
  const [formError, setFormError] = useState<string | null>(null)

  function openCreateDialog() {
    setEditingBatchId(null)
    setForm(buildEmptyForm(defaultCourseId))
    setFormError(null)
    setDialogOpen(true)
  }

  function openEditDialog(batch: AdminBatch) {
    setEditingBatchId(batch.id)
    setForm(formFromBatch(batch))
    setFormError(null)
    setDialogOpen(true)
  }

  function updateForm<K extends keyof BatchFormState>(key: K, value: BatchFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmitBatch() {
    setFormError(null)

    if (!form.courseId.trim()) {
      setFormError("Select a course.")
      return
    }

    if (form.batchName.trim().length < 3) {
      setFormError("Batch name must be at least 3 characters.")
      return
    }

    if (form.batchCode.trim().length < 3) {
      setFormError("Batch code must be at least 3 characters.")
      return
    }

    if (form.schedule.trim().length < 3) {
      setFormError("Schedule must be at least 3 characters.")
      return
    }

    const maxStudents = Number(form.maxStudents)
    if (Number.isNaN(maxStudents) || maxStudents < 1) {
      setFormError("Max students must be at least 1.")
      return
    }

    if (!editingBatchId && (!form.startDate || !form.endDate)) {
      setFormError("Start date and end date are required.")
      return
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setFormError("End date cannot be before start date.")
      return
    }

    try {
      if (editingBatchId) {
        await updateBatch(editingBatchId, {
          courseId: form.courseId,
          batchName: form.batchName.trim(),
          batchCode: form.batchCode.trim(),
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
          schedule: form.schedule.trim(),
          maxStudents,
          status: form.status,
        })
      } else {
        await createBatch({
          courseId: form.courseId,
          batchName: form.batchName.trim(),
          batchCode: form.batchCode.trim(),
          startDate: form.startDate,
          endDate: form.endDate,
          schedule: form.schedule.trim(),
          maxStudents,
          status: form.status,
          isFree: form.isFree,
        })
      }
      setDialogOpen(false)
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Failed to save batch."
      setFormError(message)
    }
  }

  if (isBatchesLoading) {
    return <PageLoadingState message="Loading batches..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  return (
    <section className="space-y-4">
      <AdminPageHeader
        title="Batches"
        actions={
          <Button onClick={openCreateDialog} disabled={isCoursesLoading || courses.length === 0}>
            Create Batch
          </Button>
        }
      />
      <InlineErrorMessage message={actionError} />

      {batches.length === 0 ? (
        <EmptyStatePanel
          title="No batch records found"
          description="Create a batch to schedule classes and enroll students."
          action={
            <Button
              size="sm"
              onClick={openCreateDialog}
              disabled={isCoursesLoading || courses.length === 0}
            >
              Create Batch
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3">
          {batches.map((batch) => (
            <AdminListCard
              key={batch.id}
              title={batch.batchName}
              subtitle={batch.courseTitle}
              headerRight={<Badge variant={batchStatusBadgeVariant(batch.status)}>{batch.status}</Badge>}
              body={
                <p className="text-sm text-muted-foreground">
                  Code: {batch.batchCode} | Schedule: {batch.schedule}
                </p>
              }
              meta={
                <p className="text-sm">
                  Enrollment: {batch.currentEnrollment}/{batch.maxStudents}
                </p>
              }
              actions={
                <Button variant="outline" size="sm" onClick={() => openEditDialog(batch)}>
                  Edit
                </Button>
              }
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBatchId ? "Edit Batch" : "Create Batch"}</DialogTitle>
            <DialogDescription>
              {editingBatchId
                ? "Update batch details and status."
                : "Create a new batch under a course."}
            </DialogDescription>
          </DialogHeader>

          <AdminFormGrid>
            <AdminFormField id="batch-course" label="Course">
              <select
                id="batch-course"
                aria-label="Select course for batch"
                value={form.courseId}
                onChange={(event) => updateForm("courseId", event.target.value)}
                className={NATIVE_SELECT_CLASS_NAME}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </AdminFormField>

            <div className="grid gap-3 md:grid-cols-2">
              <AdminFormField id="batch-name" label="Batch Name">
                <Input
                  id="batch-name"
                  value={form.batchName}
                  onChange={(event) => updateForm("batchName", event.target.value)}
                />
              </AdminFormField>
              <AdminFormField id="batch-code" label="Batch Code">
                <Input
                  id="batch-code"
                  value={form.batchCode}
                  onChange={(event) => updateForm("batchCode", event.target.value)}
                />
              </AdminFormField>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <AdminFormField id="batch-start-date" label="Start Date">
                <Input
                  id="batch-start-date"
                  type="date"
                  value={form.startDate}
                  onChange={(event) => updateForm("startDate", event.target.value)}
                />
              </AdminFormField>
              <AdminFormField id="batch-end-date" label="End Date">
                <Input
                  id="batch-end-date"
                  type="date"
                  value={form.endDate}
                  onChange={(event) => updateForm("endDate", event.target.value)}
                />
              </AdminFormField>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <AdminFormField id="batch-schedule" label="Schedule" className="md:col-span-2">
                <Input
                  id="batch-schedule"
                  value={form.schedule}
                  onChange={(event) => updateForm("schedule", event.target.value)}
                />
              </AdminFormField>
              <AdminFormField id="batch-max-students" label="Max Students">
                <Input
                  id="batch-max-students"
                  type="number"
                  min={1}
                  value={form.maxStudents}
                  onChange={(event) => updateForm("maxStudents", event.target.value)}
                />
              </AdminFormField>
            </div>

            <AdminFormField id="batch-status" label="Status">
              <select
                id="batch-status"
                aria-label="Batch status"
                value={form.status}
                onChange={(event) => updateForm("status", event.target.value as AdminBatchStatus)}
                className={NATIVE_SELECT_CLASS_NAME}
              >
                {BATCH_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </AdminFormField>

            {!editingBatchId ? (
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  aria-label="Mark batch as free beta batch"
                  checked={form.isFree}
                  onChange={(event) => updateForm("isFree", event.target.checked)}
                />
                This is a free beta batch
              </label>
            ) : null}

            <AdminFormError message={formError} />
          </AdminFormGrid>

          <DialogFooter showCloseButton>
            <Button onClick={() => void handleSubmitBatch()} disabled={isMutating}>
              {isMutating ? "Saving..." : editingBatchId ? "Update Batch" : "Create Batch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
