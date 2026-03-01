import { useCallback, useState } from "react"

import { taApi } from "@/api/ta.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { GradeAssignmentPayload, TASubmission } from "@/types/ta"

type GradingState = {
  submissions: TASubmission[]
  isLoading: boolean
  isGrading: boolean
  error: string | null
  reload: () => Promise<void>
  gradeAssignment: (
    assignmentId: string,
    payload: GradeAssignmentPayload
  ) => Promise<void>
}

export function useTAGrading(): GradingState {
  const [isGrading, setIsGrading] = useState(false)
  const loadSubmissions = useCallback(() => taApi.getSubmissionsForGrading(), [])
  const { data: submissions, isLoading, error, reload } = useAsyncResource<TASubmission[]>({
    initialData: [],
    load: loadSubmissions,
    fallbackError: "Failed to load submission queue.",
  })

  const gradeAssignment = useCallback(
    async (assignmentId: string, payload: GradeAssignmentPayload) => {
      setIsGrading(true)

      try {
        await taApi.gradeAssignment(assignmentId, payload)
        await reload()
      } finally {
        setIsGrading(false)
      }
    },
    [reload]
  )

  return {
    submissions,
    isLoading,
    isGrading,
    error,
    reload,
    gradeAssignment,
  }
}
