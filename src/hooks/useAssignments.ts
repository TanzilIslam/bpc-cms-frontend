import { useCallback, useState } from "react"

import { assignmentsApi } from "@/api/assignments.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type {
  AssignmentSubmissionPayload,
  StudentAssignment,
} from "@/types/assignment"

type AssignmentsState = {
  assignments: StudentAssignment[]
  isLoading: boolean
  error: string | null
  submittingAssignmentId: string | null
  reload: () => Promise<void>
  submitAssignment: (
    assignmentId: string,
    payload: AssignmentSubmissionPayload
  ) => Promise<void>
}

export function useAssignments(): AssignmentsState {
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null)

  const loadAssignments = useCallback(() => assignmentsApi.getMine(), [])
  const { data: assignments, isLoading, error, reload } = useAsyncResource<StudentAssignment[]>({
    initialData: [],
    load: loadAssignments,
    fallbackError: "Failed to load assignments.",
  })

  const submitAssignment = useCallback(
    async (assignmentId: string, payload: AssignmentSubmissionPayload) => {
      setSubmittingAssignmentId(assignmentId)

      try {
        await assignmentsApi.submit(assignmentId, payload)
        await reload()
      } finally {
        setSubmittingAssignmentId(null)
      }
    },
    [reload]
  )

  return {
    assignments,
    isLoading,
    error,
    submittingAssignmentId,
    reload,
    submitAssignment,
  }
}
