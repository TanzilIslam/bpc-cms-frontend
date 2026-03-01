import { useCallback } from "react"

import { adminApi } from "@/api/admin.api"
import { useAsyncMutation, useAsyncResource } from "@/hooks/useAsyncState"
import type {
  AdminBatch,
  AdminCreateBatchPayload,
  AdminUpdateBatchPayload,
} from "@/types/admin"

type AdminBatchesState = {
  batches: AdminBatch[]
  isLoading: boolean
  isMutating: boolean
  error: string | null
  actionError: string | null
  reload: () => Promise<void>
  createBatch: (payload: AdminCreateBatchPayload) => Promise<void>
  updateBatch: (batchId: string, payload: AdminUpdateBatchPayload) => Promise<void>
}

export function useAdminBatches(): AdminBatchesState {
  const loadBatches = useCallback(() => adminApi.getBatches(), [])
  const { data: batches, isLoading, error, reload } = useAsyncResource<AdminBatch[]>({
    initialData: [],
    load: loadBatches,
    fallbackError: "Failed to load batches.",
  })
  const { isMutating, actionError, runMutation } = useAsyncMutation()

  const createBatch = useCallback(
    async (payload: AdminCreateBatchPayload) => {
      await runMutation(async () => {
        await adminApi.createBatch(payload)
        await reload()
      }, "Failed to create batch.")
    },
    [reload, runMutation]
  )

  const updateBatch = useCallback(
    async (batchId: string, payload: AdminUpdateBatchPayload) => {
      await runMutation(async () => {
        await adminApi.updateBatch(batchId, payload)
        await reload()
      }, "Failed to update batch.")
    },
    [reload, runMutation]
  )

  return {
    batches,
    isLoading,
    isMutating,
    error,
    actionError,
    reload,
    createBatch,
    updateBatch,
  }
}
