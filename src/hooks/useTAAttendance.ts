import { useCallback } from "react"

import { taApi } from "@/api/ta.api"
import { useAsyncMutation } from "@/hooks/useAsyncState"
import type { AttendancePayload } from "@/types/ta"

type AttendanceAction = {
  isSubmitting: boolean
  error: string | null
  submitAttendance: (payload: AttendancePayload) => Promise<void>
}

export function useTAAttendance(): AttendanceAction {
  const { isMutating, actionError, runMutation } = useAsyncMutation()

  const submitAttendance = useCallback(async (payload: AttendancePayload): Promise<void> => {
    await runMutation(async () => taApi.markAttendance(payload), "Attendance submission failed.")
  }, [runMutation])

  return { isSubmitting: isMutating, error: actionError, submitAttendance }
}
