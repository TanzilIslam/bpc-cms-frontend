import { useCallback } from "react"

import { adminApi } from "@/api/admin.api"
import { useAsyncMutation, useAsyncResource } from "@/hooks/useAsyncState"
import type { AdminPayment, AdminRecordPaymentPayload } from "@/types/admin"

type AdminPaymentsState = {
  payments: AdminPayment[]
  isLoading: boolean
  isMutating: boolean
  error: string | null
  actionError: string | null
  reload: () => Promise<void>
  recordPayment: (payload: AdminRecordPaymentPayload) => Promise<void>
}

export function useAdminPayments(): AdminPaymentsState {
  const loadPayments = useCallback(() => adminApi.getPayments(), [])
  const { data: payments, isLoading, error, reload } = useAsyncResource<AdminPayment[]>({
    initialData: [],
    load: loadPayments,
    fallbackError: "Failed to load payments.",
  })
  const { isMutating, actionError, runMutation } = useAsyncMutation()

  const recordPayment = useCallback(
    async (payload: AdminRecordPaymentPayload) => {
      await runMutation(async () => {
        await adminApi.recordPayment(payload)
        await reload()
      }, "Failed to record payment.")
    },
    [reload, runMutation]
  )

  return { payments, isLoading, isMutating, error, actionError, reload, recordPayment }
}
