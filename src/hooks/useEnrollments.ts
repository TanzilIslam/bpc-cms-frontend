import { useCallback } from "react"

import { enrollmentsApi } from "@/api/enrollments.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { StudentEnrollment } from "@/types/enrollment"

type EnrollmentsState = {
  enrollments: StudentEnrollment[]
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useEnrollments(): EnrollmentsState {
  const loadEnrollments = useCallback(() => enrollmentsApi.getMine(), [])
  const { data: enrollments, isLoading, error, reload } = useAsyncResource<StudentEnrollment[]>(
    {
      initialData: [],
      load: loadEnrollments,
      fallbackError: "Failed to load enrollments.",
    }
  )

  return { enrollments, isLoading, error, reload }
}
