import { useCallback } from "react"

import { adminApi } from "@/api/admin.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { AdminOverview } from "@/types/admin"

type AdminOverviewState = {
  overview: AdminOverview | null
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useAdminOverview(): AdminOverviewState {
  const loadOverview = useCallback(() => adminApi.getOverview(), [])
  const { data: overview, isLoading, error, reload } = useAsyncResource<AdminOverview | null>({
    initialData: null,
    load: loadOverview,
    fallbackError: "Failed to load dashboard.",
  })

  return { overview, isLoading, error, reload }
}
