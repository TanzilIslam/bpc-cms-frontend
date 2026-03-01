import { useMemo, useState } from "react"

import {
  EmptyStatePanel,
  InlineErrorMessage,
  PageErrorState,
  PageLoadingState,
} from "@/components/shared/AsyncStates"
import { AdminActionButtons } from "@/components/shared/AdminActionButtons"
import { AdminFormError, AdminFormField, AdminFormGrid } from "@/components/shared/AdminForm"
import { AdminPageHeader } from "@/components/shared/AdminPageHeader"
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHeadCell,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/shared/AdminTable"
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
import { useAdminEnrollmentRequests } from "@/hooks/useAdminEnrollmentRequests"
import {
  ENROLLMENT_REQUEST_FILTER_OPTIONS,
  ENROLLMENT_REQUEST_STATUS_OPTIONS,
  NATIVE_SELECT_CLASS_NAME,
  NATIVE_SELECT_INLINE_CLASS_NAME,
  type EnrollmentRequestFilterOption,
} from "@/lib/admin-options"
import { enrollmentRequestStatusBadgeVariant } from "@/lib/admin-badges"
import { formatDate, formatDateTime } from "@/lib/formatters"
import type { AdminEnrollmentRequest, EnrollmentRequestStatus } from "@/types/admin"

type TimelineEntry = {
  label: string
  date: string | null
}

function buildTimeline(request: AdminEnrollmentRequest): TimelineEntry[] {
  const timeline: TimelineEntry[] = [
    {
      label: "Form Submitted",
      date: request.createdAt,
    },
  ]

  if (request.status !== "PENDING") {
    timeline.push({
      label: `Status Updated to ${request.status}`,
      date: request.updatedAt ?? request.createdAt,
    })
  }

  if (request.notes) {
    timeline.push({
      label: "Admin Note Updated",
      date: request.updatedAt ?? request.createdAt,
    })
  }

  return timeline
}

export function AdminEnrollmentRequestsPage() {
  const {
    requests,
    isLoading,
    updatingRequestId,
    convertingRequestId,
    error,
    actionError,
    reload,
    updateStatus,
    convertRequest,
  } = useAdminEnrollmentRequests()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<EnrollmentRequestFilterOption>("ALL")

  const [convertDialogOpen, setConvertDialogOpen] = useState(false)
  const [selectedConvertRequestId, setSelectedConvertRequestId] = useState<string | null>(null)
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [conversionNote, setConversionNote] = useState("")
  const [convertError, setConvertError] = useState<string | null>(null)

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedDetailsRequestId, setSelectedDetailsRequestId] = useState<string | null>(null)
  const [detailsNote, setDetailsNote] = useState("")
  const [detailsError, setDetailsError] = useState<string | null>(null)

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesFilter = filter === "ALL" ? true : request.status === filter
      const matchesSearch =
        search.trim().length === 0
          ? true
          : request.fullName.toLowerCase().includes(search.toLowerCase()) ||
            request.email.toLowerCase().includes(search.toLowerCase()) ||
            request.interestedCourse.toLowerCase().includes(search.toLowerCase())

      return matchesFilter && matchesSearch
    })
  }, [filter, requests, search])

  const selectedConvertRequest = useMemo(
    () =>
      selectedConvertRequestId
        ? requests.find((request) => request.id === selectedConvertRequestId) ?? null
        : null,
    [requests, selectedConvertRequestId]
  )

  const selectedDetailsRequest = useMemo(
    () =>
      selectedDetailsRequestId
        ? requests.find((request) => request.id === selectedDetailsRequestId) ?? null
        : null,
    [requests, selectedDetailsRequestId]
  )

  function openConvertDialog(request: AdminEnrollmentRequest) {
    setSelectedConvertRequestId(request.id)
    setGeneratedPassword("")
    setConversionNote(request.notes ?? "")
    setConvertError(null)
    setConvertDialogOpen(true)
  }

  function openDetailsDialog(request: AdminEnrollmentRequest) {
    setSelectedDetailsRequestId(request.id)
    setDetailsNote(request.notes ?? "")
    setDetailsError(null)
    setDetailsDialogOpen(true)
  }

  async function handleStatusUpdate(
    requestId: string,
    status: EnrollmentRequestStatus,
    notes?: string
  ) {
    try {
      await updateStatus(requestId, status, notes)
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Failed to update request."
      setDetailsError(message)
    }
  }

  async function handleConvertRequest() {
    if (!selectedConvertRequest) {
      return
    }

    setConvertError(null)

    try {
      await convertRequest(selectedConvertRequest.id, {
        password: generatedPassword.trim() || undefined,
        notes: conversionNote.trim() || undefined,
      })
      setConvertDialogOpen(false)
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to convert enrollment request."
      setConvertError(message)
    }
  }

  async function handleSaveDetailsNote() {
    if (!selectedDetailsRequest) {
      return
    }

    setDetailsError(null)
    await handleStatusUpdate(
      selectedDetailsRequest.id,
      selectedDetailsRequest.status,
      detailsNote.trim() || undefined
    )
  }

  async function handleSetStatusFromDetails(status: EnrollmentRequestStatus) {
    if (!selectedDetailsRequest) {
      return
    }

    setDetailsError(null)
    await handleStatusUpdate(
      selectedDetailsRequest.id,
      status,
      detailsNote.trim() || undefined
    )
  }

  if (isLoading) {
    return <PageLoadingState message="Loading enrollment requests..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  return (
    <section className="space-y-4">
      <AdminPageHeader
        title="Enrollment Requests"
        actions={
          <>
            <Input
              className="w-full max-w-xs"
              placeholder="Search applicant/course"
              aria-label="Search enrollment requests"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as EnrollmentRequestFilterOption)}
              aria-label="Filter enrollment requests by status"
              className={NATIVE_SELECT_CLASS_NAME}
            >
              {ENROLLMENT_REQUEST_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        }
      />

      {filteredRequests.length === 0 ? (
        <EmptyStatePanel
          title="No requests found"
          description={
            search.trim().length > 0 || filter !== "ALL"
              ? "No enrollment request matched your current filters."
              : "New public enrollment submissions will appear here."
          }
          action={
            search.trim().length > 0 || filter !== "ALL" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("")
                  setFilter("ALL")
                }}
              >
                Reset Filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <AdminTable minWidthClass="min-w-[900px]">
          <AdminTableHeader>
            <tr>
              <AdminTableHeadCell>Applicant</AdminTableHeadCell>
              <AdminTableHeadCell>Course</AdminTableHeadCell>
              <AdminTableHeadCell>Contact</AdminTableHeadCell>
              <AdminTableHeadCell>Laptop</AdminTableHeadCell>
              <AdminTableHeadCell>Internet</AdminTableHeadCell>
              <AdminTableHeadCell>Status</AdminTableHeadCell>
              <AdminTableHeadCell>Submitted</AdminTableHeadCell>
              <AdminTableHeadCell>Actions</AdminTableHeadCell>
            </tr>
          </AdminTableHeader>
          <AdminTableBody>
            {filteredRequests.map((request) => (
              <AdminTableRow key={request.id}>
                <AdminTableCell className="font-medium">{request.fullName}</AdminTableCell>
                <AdminTableCell>{request.interestedCourse}</AdminTableCell>
                <AdminTableCell>
                  <div>{request.email}</div>
                  <div className="text-muted-foreground">{request.phone}</div>
                </AdminTableCell>
                <AdminTableCell>{request.hasLaptop ? "Yes" : "No"}</AdminTableCell>
                <AdminTableCell>{request.hasInternet ? "Yes" : "No"}</AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={enrollmentRequestStatusBadgeVariant(request.status)}>
                      {request.status}
                    </Badge>
                    <select
                      value={request.status}
                      onChange={(event) =>
                        void handleStatusUpdate(
                          request.id,
                          event.target.value as EnrollmentRequestStatus,
                          request.notes ?? undefined
                        )
                      }
                      disabled={
                        updatingRequestId === request.id || convertingRequestId === request.id
                      }
                      aria-label={`Update status for ${request.fullName}`}
                      className={NATIVE_SELECT_INLINE_CLASS_NAME}
                    >
                      {ENROLLMENT_REQUEST_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </AdminTableCell>
                <AdminTableCell>{formatDate(request.createdAt)}</AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => openDetailsDialog(request)}>
                      Details
                    </Button>
                    {request.status === "ENROLLED" ? (
                      <span className="text-xs text-muted-foreground">Converted</span>
                    ) : request.status === "REJECTED" ? (
                      <span className="text-xs text-muted-foreground">Rejected</span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={convertingRequestId === request.id}
                        onClick={() => openConvertDialog(request)}
                      >
                        {convertingRequestId === request.id ? "Converting..." : "Convert"}
                      </Button>
                    )}
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      )}
      <InlineErrorMessage message={actionError} />

      <Dialog
        open={convertDialogOpen}
        onOpenChange={(open) => {
          setConvertDialogOpen(open)
          if (!open) {
            setSelectedConvertRequestId(null)
            setGeneratedPassword("")
            setConversionNote("")
            setConvertError(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Convert to Student</DialogTitle>
            <DialogDescription>
              This will convert the enrollment request and mark it as enrolled.
            </DialogDescription>
          </DialogHeader>

          <AdminFormGrid>
            <div className="rounded-md border p-3 text-sm">
              <p className="font-medium">{selectedConvertRequest?.fullName ?? "-"}</p>
              <p className="text-muted-foreground">{selectedConvertRequest?.email ?? "-"}</p>
              <p className="text-muted-foreground">{selectedConvertRequest?.phone ?? "-"}</p>
              <p className="mt-2 text-muted-foreground">
                Course: {selectedConvertRequest?.interestedCourse ?? "-"}
              </p>
            </div>

            <AdminFormField id="conversion-password" label="Initial Password (optional)">
              <Input
                id="conversion-password"
                type="text"
                value={generatedPassword}
                onChange={(event) => setGeneratedPassword(event.target.value)}
                placeholder="Leave blank to use backend default"
              />
            </AdminFormField>

            <AdminFormField id="conversion-note" label="Admin Note (optional)">
              <Textarea
                id="conversion-note"
                rows={3}
                value={conversionNote}
                onChange={(event) => setConversionNote(event.target.value)}
                placeholder="Note about conversion/contact outcome"
              />
            </AdminFormField>

            <AdminFormError message={convertError} />
          </AdminFormGrid>

          <DialogFooter showCloseButton>
            <Button
              onClick={() => void handleConvertRequest()}
              disabled={
                !selectedConvertRequest ||
                convertingRequestId === selectedConvertRequest.id
              }
            >
              {selectedConvertRequest && convertingRequestId === selectedConvertRequest.id
                ? "Converting..."
                : "Convert Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={detailsDialogOpen}
        onOpenChange={(open) => {
          setDetailsDialogOpen(open)
          if (!open) {
            setSelectedDetailsRequestId(null)
            setDetailsNote("")
            setDetailsError(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enrollment Request Details</DialogTitle>
            <DialogDescription>
              Review applicant details, add notes, and manage contact status.
            </DialogDescription>
          </DialogHeader>

          {selectedDetailsRequest ? (
            <div className="grid gap-4">
              <div className="grid gap-3 rounded-md border p-3 text-sm md:grid-cols-2">
                <div>
                  <p className="font-medium">{selectedDetailsRequest.fullName}</p>
                  <p className="text-muted-foreground">{selectedDetailsRequest.email}</p>
                  <p className="text-muted-foreground">{selectedDetailsRequest.phone}</p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">Course:</span>{" "}
                    {selectedDetailsRequest.interestedCourse}
                  </p>
                  <p>
                    <span className="font-medium">Laptop:</span>{" "}
                    {selectedDetailsRequest.hasLaptop ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-medium">Internet:</span>{" "}
                    {selectedDetailsRequest.hasInternet ? "Yes" : "No"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p>
                    <span className="font-medium">Laptop Specs:</span>{" "}
                    {selectedDetailsRequest.laptopSpecs ?? "-"}
                  </p>
                  <p className="mt-1">
                    <span className="font-medium">Why Join:</span>{" "}
                    {selectedDetailsRequest.whyJoin ?? "-"}
                  </p>
                  <p className="mt-1">
                    <span className="font-medium">Submitted:</span>{" "}
                    {formatDateTime(selectedDetailsRequest.createdAt)}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {formatDateTime(selectedDetailsRequest.updatedAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 rounded-md border p-3">
                <p className="text-sm font-medium">Status Timeline</p>
                <div className="grid gap-2">
                  {buildTimeline(selectedDetailsRequest).map((entry, index) => (
                    <div key={`${entry.label}-${index}`} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span>{entry.label}</span>
                      <span className="text-muted-foreground">
                        {formatDateTime(entry.date, "Unknown")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <AdminFormField id="enrollment-details-note" label="Admin Notes">
                <Textarea
                  id="enrollment-details-note"
                  rows={4}
                  value={detailsNote}
                  onChange={(event) => setDetailsNote(event.target.value)}
                  placeholder="Add call notes, follow-up details, or decision context"
                />
              </AdminFormField>

              <AdminActionButtons
                items={[
                  {
                    key: "mark-contacted",
                    label: "Mark Contacted",
                    variant: "outline",
                    size: "sm",
                    disabled: updatingRequestId === selectedDetailsRequest.id,
                    onClick: () => void handleSetStatusFromDetails("CONTACTED"),
                  },
                  {
                    key: "mark-pending",
                    label: "Mark Pending",
                    variant: "outline",
                    size: "sm",
                    disabled: updatingRequestId === selectedDetailsRequest.id,
                    onClick: () => void handleSetStatusFromDetails("PENDING"),
                  },
                  {
                    key: "mark-rejected",
                    label: "Mark Rejected",
                    variant: "outline",
                    size: "sm",
                    disabled: updatingRequestId === selectedDetailsRequest.id,
                    onClick: () => void handleSetStatusFromDetails("REJECTED"),
                  },
                ]}
              />

              <AdminFormError message={detailsError} />
            </div>
          ) : null}

          <DialogFooter showCloseButton>
            <Button
              onClick={() => void handleSaveDetailsNote()}
              disabled={
                !selectedDetailsRequest ||
                updatingRequestId === selectedDetailsRequest.id
              }
            >
              {selectedDetailsRequest &&
              updatingRequestId === selectedDetailsRequest.id
                ? "Saving..."
                : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
