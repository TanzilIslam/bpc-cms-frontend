import { useCallback } from "react"

import { enrollmentsApi } from "@/api/enrollments.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { StudentProgress } from "@/types/enrollment"

type StudentProgressState = {
  progress: StudentProgress | null
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useStudentProgress(): StudentProgressState {
  const loadProgress = useCallback(() => enrollmentsApi.getMyProgress(), [])
  const { data: progress, isLoading, error, reload } = useAsyncResource<StudentProgress | null>({
    initialData: null,
    load: loadProgress,
    fallbackError: "Failed to load progress.",
  })

  return { progress, isLoading, error, reload }
}
