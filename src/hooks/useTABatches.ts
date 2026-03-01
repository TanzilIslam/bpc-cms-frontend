import { useCallback, useState } from "react"

import { taApi } from "@/api/ta.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { TABatch, TABatchStudent } from "@/types/ta"

type BatchesState = {
  batches: TABatch[]
  studentsByBatch: Record<string, TABatchStudent[]>
  isLoading: boolean
  error: string | null
  loadingBatchId: string | null
  reload: () => Promise<void>
  loadStudents: (batchId: string) => Promise<void>
}

export function useTABatches(): BatchesState {
  const [studentsByBatch, setStudentsByBatch] = useState<Record<string, TABatchStudent[]>>({})
  const [loadingBatchId, setLoadingBatchId] = useState<string | null>(null)
  const loadBatches = useCallback(() => taApi.getMyBatches(), [])
  const { data: batches, isLoading, error, reload } = useAsyncResource<TABatch[]>({
    initialData: [],
    load: loadBatches,
    fallbackError: "Failed to load batches.",
  })

  const loadStudents = useCallback(async (batchId: string) => {
    setLoadingBatchId(batchId)

    try {
      const students = await taApi.getBatchStudents(batchId)
      setStudentsByBatch((prev) => ({ ...prev, [batchId]: students }))
    } finally {
      setLoadingBatchId(null)
    }
  }, [])

  return {
    batches,
    studentsByBatch,
    isLoading,
    error,
    loadingBatchId,
    reload,
    loadStudents,
  }
}
