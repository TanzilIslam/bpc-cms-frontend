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
import { AdminFormError, AdminFormField, AdminFormGrid } from "@/components/shared/AdminForm"
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
import { Textarea } from "@/components/ui/textarea"
import { useAdminEnrollments } from "@/hooks/useAdminEnrollments"
import { useAdminPayments } from "@/hooks/useAdminPayments"
import {
  NATIVE_SELECT_CLASS_NAME,
  NATIVE_SELECT_COMPACT_CLASS_NAME,
  PAYMENT_FILTER_OPTIONS,
  PAYMENT_INSTALLMENT_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  type PaymentFilterOption,
} from "@/lib/admin-options"
import { paymentStatusBadgeVariant } from "@/lib/admin-badges"
import { formatDate, formatMoney } from "@/lib/formatters"
import type { AdminPaymentMethod, AdminPaymentStatus } from "@/types/admin"

type PaymentFormState = {
  enrollmentId: string
  amount: string
  installmentNumber: "1" | "2"
  paymentMethod: AdminPaymentMethod
  status: AdminPaymentStatus
  transactionId: string
  notes: string
}

const emptyPaymentForm: PaymentFormState = {
  enrollmentId: "",
  amount: "5000",
  installmentNumber: "1",
  paymentMethod: "BKASH",
  status: "CONFIRMED",
  transactionId: "",
  notes: "",
}

export function AdminPaymentsPage() {
  const {
    payments,
    isLoading,
    isMutating,
    error,
    actionError,
    reload,
    recordPayment,
  } = useAdminPayments()
  const {
    enrollments,
    isLoading: isEnrollmentsLoading,
    error: enrollmentsError,
    reload: reloadEnrollments,
  } = useAdminEnrollments()
  const [filter, setFilter] = useState<PaymentFilterOption>("ALL")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<PaymentFormState>(emptyPaymentForm)
  const [formError, setFormError] = useState<string | null>(null)

  const filteredPayments = useMemo(() => {
    if (filter === "ALL") {
      return payments
    }

    return payments.filter((payment) => payment.status === filter)
  }, [filter, payments])

  const selectedEnrollment = useMemo(
    () => enrollments.find((enrollment) => enrollment.id === form.enrollmentId) ?? null,
    [enrollments, form.enrollmentId]
  )

  function updateForm<K extends keyof PaymentFormState>(key: K, value: PaymentFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function openPaymentDialog() {
    setForm({
      ...emptyPaymentForm,
      enrollmentId: enrollments[0]?.id ?? "",
    })
    setFormError(null)
    setDialogOpen(true)
  }

  async function handleSubmitPayment() {
    setFormError(null)

    if (!form.enrollmentId.trim()) {
      setFormError("Enrollment ID is required.")
      return
    }

    if (!selectedEnrollment || !selectedEnrollment.studentId) {
      setFormError("Select a valid enrollment.")
      return
    }

    const amount = Number(form.amount)
    if (Number.isNaN(amount) || amount <= 0) {
      setFormError("Amount must be greater than 0.")
      return
    }

    try {
      await recordPayment({
        enrollmentId: form.enrollmentId.trim(),
        studentId: selectedEnrollment.studentId,
        amount,
        installmentNumber: Number(form.installmentNumber),
        paymentMethod: form.paymentMethod,
        status: form.status,
        transactionId: form.transactionId.trim() || undefined,
        notes: form.notes.trim() || undefined,
      })
      setDialogOpen(false)
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Failed to record payment."
      setFormError(message)
    }
  }

  if (isLoading) {
    return <PageLoadingState message="Loading payments..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  return (
    <section className="space-y-4">
      <AdminPageHeader
        title="Payments"
        actions={
          <>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as PaymentFilterOption)}
              className={NATIVE_SELECT_COMPACT_CLASS_NAME}
            >
              {PAYMENT_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button
              onClick={openPaymentDialog}
              disabled={isEnrollmentsLoading || enrollments.length === 0}
            >
              Record Payment
            </Button>
          </>
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

      {filteredPayments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No payments in this filter.</p>
      ) : (
        <AdminTable minWidthClass="min-w-[680px]">
          <AdminTableHeader>
            <tr>
              <AdminTableHeadCell>Student</AdminTableHeadCell>
              <AdminTableHeadCell>Amount</AdminTableHeadCell>
              <AdminTableHeadCell>Method</AdminTableHeadCell>
              <AdminTableHeadCell>Status</AdminTableHeadCell>
              <AdminTableHeadCell>Date</AdminTableHeadCell>
            </tr>
          </AdminTableHeader>
          <AdminTableBody>
            {filteredPayments.map((payment) => (
              <AdminTableRow key={payment.id}>
                <AdminTableCell className="font-medium">{payment.studentName}</AdminTableCell>
                <AdminTableCell>{formatMoney(payment.amount)}</AdminTableCell>
                <AdminTableCell>{payment.paymentMethod}</AdminTableCell>
                <AdminTableCell>
                  <Badge variant={paymentStatusBadgeVariant(payment.status)}>
                    {payment.status}
                  </Badge>
                </AdminTableCell>
                <AdminTableCell>{formatDate(payment.paymentDate)}</AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>Save a new payment transaction for a student.</DialogDescription>
          </DialogHeader>

          <AdminFormGrid>
            <AdminFormField
              id="payment-enrollment-id"
              label="Enrollment"
              hint={
                selectedEnrollment
                  ? `Paid: ${formatMoney(selectedEnrollment.amountPaid)} of ${formatMoney(
                      selectedEnrollment.totalFee
                    )}`
                  : undefined
              }
            >
              <select
                id="payment-enrollment-id"
                value={form.enrollmentId}
                onChange={(event) => updateForm("enrollmentId", event.target.value)}
                className={NATIVE_SELECT_CLASS_NAME}
              >
                {enrollments.map((enrollment) => (
                  <option key={enrollment.id} value={enrollment.id}>
                    {enrollment.studentName} | {enrollment.courseTitle} | {enrollment.batchName}
                  </option>
                ))}
              </select>
            </AdminFormField>

            <div className="grid gap-3 md:grid-cols-3">
              <AdminFormField id="payment-amount" label="Amount">
                <Input
                  id="payment-amount"
                  type="number"
                  min={1}
                  value={form.amount}
                  onChange={(event) => updateForm("amount", event.target.value)}
                />
              </AdminFormField>
              <AdminFormField id="payment-installment" label="Installment">
                <select
                  id="payment-installment"
                  value={form.installmentNumber}
                  onChange={(event) =>
                    updateForm("installmentNumber", event.target.value as "1" | "2")
                  }
                  className={NATIVE_SELECT_CLASS_NAME}
                >
                  {PAYMENT_INSTALLMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </AdminFormField>
              <AdminFormField id="payment-method" label="Method">
                <select
                  id="payment-method"
                  value={form.paymentMethod}
                  onChange={(event) =>
                    updateForm("paymentMethod", event.target.value as AdminPaymentMethod)
                  }
                  className={NATIVE_SELECT_CLASS_NAME}
                >
                  {PAYMENT_METHOD_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </AdminFormField>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <AdminFormField id="payment-status" label="Status">
                <select
                  id="payment-status"
                  value={form.status}
                  onChange={(event) =>
                    updateForm("status", event.target.value as AdminPaymentStatus)
                  }
                  className={NATIVE_SELECT_CLASS_NAME}
                >
                  {PAYMENT_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </AdminFormField>
              <AdminFormField id="payment-transaction-id" label="Transaction ID (optional)">
                <Input
                  id="payment-transaction-id"
                  value={form.transactionId}
                  onChange={(event) => updateForm("transactionId", event.target.value)}
                />
              </AdminFormField>
            </div>

            <AdminFormField id="payment-notes" label="Notes (optional)">
              <Textarea
                id="payment-notes"
                rows={3}
                value={form.notes}
                onChange={(event) => updateForm("notes", event.target.value)}
              />
            </AdminFormField>

            <AdminFormError message={formError} />
          </AdminFormGrid>

          <DialogFooter showCloseButton>
            <Button onClick={() => void handleSubmitPayment()} disabled={isMutating}>
              {isMutating ? "Saving..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
