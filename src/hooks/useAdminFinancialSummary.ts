import { useCallback } from "react"

import { adminApi } from "@/api/admin.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { AdminFinancialSummary } from "@/types/admin"

type AdminFinancialSummaryState = {
  summary: AdminFinancialSummary | null
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useAdminFinancialSummary(): AdminFinancialSummaryState {
  const loadSummary = useCallback(() => adminApi.getFinancialSummary(), [])
  const { data: summary, isLoading, error, reload } = useAsyncResource<AdminFinancialSummary | null>(
    {
      initialData: null,
      load: loadSummary,
      fallbackError: "Failed to load financial summary.",
    }
  )

  return { summary, isLoading, error, reload }
}
