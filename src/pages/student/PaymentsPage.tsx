import { useMemo, useState } from "react"

import { PageErrorState, PageLoadingState } from "@/components/shared/AsyncStates"
import { MetricCard } from "@/components/shared/MetricCard"
import { PageHeader } from "@/components/shared/PageHeader"
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHeadCell,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/shared/AdminTable"
import { Badge } from "@/components/ui/badge"
import { useEnrollments } from "@/hooks/useEnrollments"
import { useStudentPayments } from "@/hooks/useStudentPayments"
import { formatDate, formatMoney } from "@/lib/formatters"
import type { StudentPaymentStatus } from "@/types/payment"

type PaymentFilter = "ALL" | StudentPaymentStatus

export function StudentPaymentsPage() {
  const { enrollments, isLoading: isEnrollmentsLoading } = useEnrollments()
  const { payments, isLoading, error, reload } = useStudentPayments()
  const [filter, setFilter] = useState<PaymentFilter>("ALL")

  const filteredPayments = useMemo(() => {
    if (filter === "ALL") {
      return payments
    }

    return payments.filter((payment) => payment.status === filter)
  }, [filter, payments])

  const totals = useMemo(() => {
    const totalFee = enrollments.reduce((sum, enrollment) => sum + enrollment.totalFee, 0)
    const amountPaid = enrollments.reduce((sum, enrollment) => sum + enrollment.amountPaid, 0)
    return {
      totalFee,
      amountPaid,
      outstanding: Math.max(totalFee - amountPaid, 0),
    }
  }, [enrollments])

  const metrics = [
    { label: "Total Course Fee", value: formatMoney(totals.totalFee) },
    { label: "Amount Paid", value: formatMoney(totals.amountPaid) },
    { label: "Outstanding", value: formatMoney(totals.outstanding) },
  ]

  if (isLoading || isEnrollmentsLoading) {
    return <PageLoadingState message="Loading payments..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  return (
    <section className="space-y-5">
      <PageHeader
        title="My Payments"
        actions={
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as PaymentFilter)}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>

      {filteredPayments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No payment records found.</p>
      ) : (
        <AdminTable minWidthClass="min-w-[760px]">
          <AdminTableHeader>
            <tr>
              <AdminTableHeadCell>Amount</AdminTableHeadCell>
              <AdminTableHeadCell>Method</AdminTableHeadCell>
              <AdminTableHeadCell>Installment</AdminTableHeadCell>
              <AdminTableHeadCell>Status</AdminTableHeadCell>
              <AdminTableHeadCell>Transaction</AdminTableHeadCell>
              <AdminTableHeadCell>Date</AdminTableHeadCell>
            </tr>
          </AdminTableHeader>
          <AdminTableBody>
            {filteredPayments.map((payment) => (
              <AdminTableRow key={payment.id}>
                <AdminTableCell className="font-medium">{formatMoney(payment.amount)}</AdminTableCell>
                <AdminTableCell>{payment.paymentMethod}</AdminTableCell>
                <AdminTableCell>{payment.installmentNumber ?? "-"}</AdminTableCell>
                <AdminTableCell>
                  <Badge
                    variant={
                      payment.status === "CONFIRMED"
                        ? "default"
                        : payment.status === "PENDING"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {payment.status}
                  </Badge>
                </AdminTableCell>
                <AdminTableCell>{payment.transactionId ?? "-"}</AdminTableCell>
                <AdminTableCell>{formatDate(payment.paymentDate)}</AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      )}
    </section>
  )
}
