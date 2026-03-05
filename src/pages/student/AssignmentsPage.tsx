import { useMemo, useState } from "react"

import { filesApi } from "@/api/files.api"
import { useDropzone } from "react-dropzone"
import { FileText, Upload, X } from "lucide-react"

import { PageErrorState, PageLoadingState } from "@/components/shared/AsyncStates"
import { AdminListCard } from "@/components/shared/AdminListCard"
import { PageHeader } from "@/components/shared/PageHeader"
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
import { Textarea } from "@/components/ui/textarea"
import { useAssignments } from "@/hooks/useAssignments"
import { formatDate } from "@/lib/formatters"
import type { StudentAssignment, SubmissionStatus } from "@/types/assignment"

type AssignmentFilter = "ALL" | SubmissionStatus

type SubmissionDialogProps = {
  assignment: StudentAssignment | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (payload: {
    githubLink?: string
    liveDemoLink?: string
    notes?: string
    filePaths: string[]
  }) => Promise<void>
}

function SubmissionDialog({
  assignment,
  isSubmitting,
  onClose,
  onSubmit,
}: SubmissionDialogProps) {
  const [githubLink, setGithubLink] = useState("")
  const [liveDemoLink, setLiveDemoLink] = useState("")
  const [notes, setNotes] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  const dropzone = useDropzone({
    multiple: true,
    maxSize: 10 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles])
    },
  })

  async function handleSubmit() {
    if (!assignment) {
      return
    }

    setError(null)

    try {
      const uploadedFiles = await Promise.all(
        files.map((file) =>
          filesApi.upload(file, {
            entityType: "ASSIGNMENT",
            entityId: assignment.id,
            isPublic: false,
          })
        )
      )

      await onSubmit({
        githubLink: githubLink || undefined,
        liveDemoLink: liveDemoLink || undefined,
        notes: notes || undefined,
        filePaths: uploadedFiles.map((item) => item.filePath),
      })
      setGithubLink("")
      setLiveDemoLink("")
      setNotes("")
      setFiles([])
      onClose()
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Submission failed."
      setError(message)
    }
  }

  return (
    <Dialog open={Boolean(assignment)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Submit Assignment</DialogTitle>
          <DialogDescription>{assignment?.title ?? ""}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <Input
            placeholder="GitHub repository link (optional)"
            value={githubLink}
            onChange={(event) => setGithubLink(event.target.value)}
          />
          <Input
            placeholder="Live demo link (optional)"
            value={liveDemoLink}
            onChange={(event) => setLiveDemoLink(event.target.value)}
          />
          <Textarea
            rows={4}
            placeholder="Notes for reviewer"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />

          <div
            {...dropzone.getRootProps()}
            className="cursor-pointer rounded-md border border-dashed p-4"
          >
            <input {...dropzone.getInputProps()} />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Upload className="size-4" />
              Drag & drop files, or click to browse (max 10MB each)
            </div>
          </div>

          {files.length > 0 ? (
            <div className="grid gap-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <span className="truncate pr-2">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <DialogFooter showCloseButton>
          <Button onClick={() => void handleSubmit()} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function badgeVariant(status: SubmissionStatus): "default" | "outline" | "secondary" {
  if (status === "GRADED") {
    return "default"
  }

  if (status === "SUBMITTED") {
    return "secondary"
  }

  return "outline"
}

export function AssignmentsPage() {
  const {
    assignments,
    isLoading,
    error,
    reload,
    submitAssignment,
    submittingAssignmentId,
  } = useAssignments()

  const [filter, setFilter] = useState<AssignmentFilter>("ALL")
  const [selectedAssignment, setSelectedAssignment] = useState<StudentAssignment | null>(null)

  const filteredAssignments = useMemo(() => {
    if (filter === "ALL") {
      return assignments
    }

    return assignments.filter((assignment) => assignment.status === filter)
  }, [assignments, filter])

  async function handleSubmit(payload: {
    githubLink?: string
    liveDemoLink?: string
    notes?: string
    filePaths: string[]
  }) {
    if (!selectedAssignment) {
      return
    }

    await submitAssignment(selectedAssignment.id, payload)
  }

  if (isLoading) {
    return <PageLoadingState message="Loading assignments..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  return (
    <section className="space-y-4">
      <PageHeader
        title="Assignments"
        actions={
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as AssignmentFilter)}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            <option value="ALL">All</option>
            <option value="NOT_SUBMITTED">Not Submitted</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="GRADED">Graded</option>
            <option value="REVISION_NEEDED">Revision Needed</option>
          </select>
        }
      />

      {filteredAssignments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No assignments in this filter.</p>
      ) : (
        <div className="grid gap-3">
          {filteredAssignments.map((assignment) => (
            <AdminListCard
              key={assignment.id}
              title={assignment.title}
              subtitle={`Due: ${formatDate(assignment.dueDate, "No deadline")}`}
              headerRight={<Badge variant={badgeVariant(assignment.status)}>{assignment.status}</Badge>}
              body={<p className="text-sm text-muted-foreground">{assignment.description}</p>}
              meta={
                <>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span>Type: {assignment.assignmentType}</span>
                    <span>Max Score: {assignment.maxScore}</span>
                    {assignment.score !== null ? <span>Score: {assignment.score}</span> : null}
                  </div>
                  {assignment.feedback ? (
                    <div className="rounded-md bg-muted p-3 text-sm">
                      <p className="mb-1 font-medium">Feedback</p>
                      <p className="text-muted-foreground">{assignment.feedback}</p>
                    </div>
                  ) : null}
                </>
              }
              actions={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedAssignment(assignment)}
                  disabled={assignment.status === "GRADED"}
                >
                  <FileText className="mr-2 size-4" />
                  {assignment.status === "REVISION_NEEDED"
                    ? "Resubmit"
                    : assignment.status === "NOT_SUBMITTED"
                      ? "Submit"
                      : "Update Submission"}
                </Button>
              }
            />
          ))}
        </div>
      )}

      <SubmissionDialog
        assignment={selectedAssignment}
        isSubmitting={
          Boolean(selectedAssignment) && submittingAssignmentId === selectedAssignment?.id
        }
        onClose={() => setSelectedAssignment(null)}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
