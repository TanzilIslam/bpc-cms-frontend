import { useCallback } from "react"

import { studentsApi } from "@/api/students.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { StudentProfile } from "@/types/student"

type StudentProfileState = {
  profile: StudentProfile | null
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useStudentProfile(): StudentProfileState {
  const loadProfile = useCallback(() => studentsApi.getMe(), [])
  const { data: profile, isLoading, error, reload } = useAsyncResource<StudentProfile | null>({
    initialData: null,
    load: loadProfile,
    fallbackError: "Failed to load student profile.",
  })

  return { profile, isLoading, error, reload }
}
