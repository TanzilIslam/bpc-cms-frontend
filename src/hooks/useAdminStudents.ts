import { useCallback } from "react"

import { adminApi } from "@/api/admin.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { AdminStudent } from "@/types/admin"

type AdminStudentsState = {
  students: AdminStudent[]
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useAdminStudents(): AdminStudentsState {
  const loadStudents = useCallback(() => adminApi.getStudents(), [])
  const { data: students, isLoading, error, reload } = useAsyncResource<AdminStudent[]>({
    initialData: [],
    load: loadStudents,
    fallbackError: "Failed to load students.",
  })

  return { students, isLoading, error, reload }
}
