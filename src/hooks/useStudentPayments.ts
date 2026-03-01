import { useCallback } from "react"

import { paymentsApi } from "@/api/payments.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { StudentPayment } from "@/types/payment"

type StudentPaymentsState = {
  payments: StudentPayment[]
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useStudentPayments(): StudentPaymentsState {
  const loadPayments = useCallback(() => paymentsApi.getMine(), [])
  const { data: payments, isLoading, error, reload } = useAsyncResource<StudentPayment[]>({
    initialData: [],
    load: loadPayments,
    fallbackError: "Failed to load payments.",
  })

  return { payments, isLoading, error, reload }
}
