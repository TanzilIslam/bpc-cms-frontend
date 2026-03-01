import { useCallback } from "react"

import { adminApi } from "@/api/admin.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { AdminEnrollment } from "@/types/admin"

type AdminEnrollmentsState = {
  enrollments: AdminEnrollment[]
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useAdminEnrollments(): AdminEnrollmentsState {
  const loadEnrollments = useCallback(() => adminApi.getEnrollments(), [])
  const { data: enrollments, isLoading, error, reload } = useAsyncResource<AdminEnrollment[]>({
    initialData: [],
    load: loadEnrollments,
    fallbackError: "Failed to load enrollments.",
  })

  return { enrollments, isLoading, error, reload }
}
