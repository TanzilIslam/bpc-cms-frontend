import { useMemo, useState } from "react"

import {
  InlineErrorMessage,
  PageErrorState,
  PageLoadingState,
} from "@/components/shared/AsyncStates"
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHeadCell,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/shared/AdminTable"
import { AdminFormField } from "@/components/shared/AdminForm"
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
import { useAdminEnrollments } from "@/hooks/useAdminEnrollments"
import { useAdminCertificates } from "@/hooks/useAdminCertificates"
import { NATIVE_SELECT_CLASS_NAME } from "@/lib/admin-options"
import { verificationBadgeVariant } from "@/lib/admin-badges"
import { formatDate } from "@/lib/formatters"

export function AdminCertificatesPage() {
  const {
    certificates,
    isLoading,
    isMutating,
    error,
    actionError,
    reload,
    generateCertificate,
  } = useAdminCertificates()
  const {
    enrollments,
    isLoading: isEnrollmentsLoading,
    error: enrollmentsError,
    reload: reloadEnrollments,
  } = useAdminEnrollments()

  const completedEnrollments = useMemo(
    () => enrollments.filter((enrollment) => enrollment.enrollmentStatus === "COMPLETED"),
    [enrollments]
  )

  const [dialogOpen, setDialogOpen] = useState(false)
  const [enrollmentId, setEnrollmentId] = useState("")
  const [formError, setFormError] = useState<string | null>(null)

  function openGenerateDialog() {
    setEnrollmentId(completedEnrollments[0]?.id ?? "")
    setFormError(null)
    setDialogOpen(true)
  }

  async function handleGenerate(enrollment: string) {
    const value = enrollment.trim()
    if (!value) {
      setFormError("Enrollment ID is required.")
      return
    }

    setFormError(null)

    try {
      await generateCertificate({ enrollmentId: value })
      setDialogOpen(false)
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Failed to generate certificate."
      setFormError(message)
    }
  }

  if (isLoading) {
    return <PageLoadingState message="Loading certificates..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  return (
    <section className="space-y-4">
      <AdminPageHeader
        title="Certificates"
        actions={
          <Button
            onClick={openGenerateDialog}
            disabled={isEnrollmentsLoading || completedEnrollments.length === 0}
          >
            Generate Certificate
          </Button>
        }
      />
      <InlineErrorMessage message={actionError} />
      <InlineErrorMessage
        message={enrollmentsError}
        action={
          <Button variant="outline" size="sm" onClick={() => void reloadEnrollments()}>
            Retry Enrollment Load
          </Button>
        }
      />

      {certificates.length === 0 ? (
        <p className="text-sm text-muted-foreground">No certificates issued yet.</p>
      ) : (
        <AdminTable minWidthClass="min-w-[860px]">
          <AdminTableHeader>
            <tr>
              <AdminTableHeadCell>Code</AdminTableHeadCell>
              <AdminTableHeadCell>Student</AdminTableHeadCell>
              <AdminTableHeadCell>Course</AdminTableHeadCell>
              <AdminTableHeadCell>Grade</AdminTableHeadCell>
              <AdminTableHeadCell>Issued</AdminTableHeadCell>
              <AdminTableHeadCell>Verification</AdminTableHeadCell>
              <AdminTableHeadCell>Action</AdminTableHeadCell>
            </tr>
          </AdminTableHeader>
          <AdminTableBody>
            {certificates.map((certificate) => (
              <AdminTableRow key={certificate.id}>
                <AdminTableCell className="font-medium">
                  {certificate.certificateCode}
                </AdminTableCell>
                <AdminTableCell>{certificate.studentName}</AdminTableCell>
                <AdminTableCell>{certificate.courseTitle}</AdminTableCell>
                <AdminTableCell>{certificate.grade}</AdminTableCell>
                <AdminTableCell>{formatDate(certificate.issueDate)}</AdminTableCell>
                <AdminTableCell>
                  <Badge variant={verificationBadgeVariant(certificate.isVerified)}>
                    {certificate.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </AdminTableCell>
                <AdminTableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!certificate.enrollmentId || isMutating}
                    onClick={() => void handleGenerate(certificate.enrollmentId)}
                  >
                    Regenerate
                  </Button>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate Certificate</DialogTitle>
            <DialogDescription>
              Select a completed enrollment to issue a certificate.
            </DialogDescription>
          </DialogHeader>

          <AdminFormField id="certificate-enrollment-id" label="Enrollment" error={formError}>
            {completedEnrollments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No completed enrollments available for certificate generation.
              </p>
            ) : (
              <select
                id="certificate-enrollment-id"
                value={enrollmentId}
                onChange={(event) => setEnrollmentId(event.target.value)}
                className={NATIVE_SELECT_CLASS_NAME}
              >
                {completedEnrollments.map((enrollment) => (
                  <option key={enrollment.id} value={enrollment.id}>
                    {enrollment.studentName} | {enrollment.courseTitle} | {enrollment.batchName}
                  </option>
                ))}
              </select>
            )}
          </AdminFormField>

          <DialogFooter showCloseButton>
            <Button onClick={() => void handleGenerate(enrollmentId)} disabled={isMutating}>
              {isMutating ? "Generating..." : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
