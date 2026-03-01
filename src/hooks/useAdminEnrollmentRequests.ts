import { useCallback, useState } from "react"

import { adminApi } from "@/api/admin.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type {
  AdminConvertEnrollmentRequestPayload,
  AdminEnrollmentRequest,
  EnrollmentRequestStatus,
} from "@/types/admin"

type AdminEnrollmentRequestsState = {
  requests: AdminEnrollmentRequest[]
  isLoading: boolean
  updatingRequestId: string | null
  convertingRequestId: string | null
  error: string | null
  actionError: string | null
  reload: () => Promise<void>
  updateStatus: (
    requestId: string,
    status: EnrollmentRequestStatus,
    notes?: string
  ) => Promise<void>
  convertRequest: (requestId: string, payload?: AdminConvertEnrollmentRequestPayload) => Promise<void>
}

export function useAdminEnrollmentRequests(): AdminEnrollmentRequestsState {
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null)
  const [convertingRequestId, setConvertingRequestId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const loadRequests = useCallback(() => adminApi.getEnrollmentRequests(), [])
  const { data: requests, setData: setRequests, isLoading, error, reload } = useAsyncResource<
    AdminEnrollmentRequest[]
  >({
    initialData: [],
    load: loadRequests,
    fallbackError: "Failed to load enrollment requests.",
  })

  const updateStatus = useCallback(
    async (requestId: string, status: EnrollmentRequestStatus, notes?: string) => {
      setUpdatingRequestId(requestId)
      setActionError(null)

      try {
        const updated = await adminApi.updateEnrollmentRequestStatus(
          requestId,
          status,
          notes
        )
        setRequests((prev) =>
          prev.map((request) => (request.id === requestId ? updated : request))
        )
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Failed to update request status."
        setActionError(message)
        throw requestError
      } finally {
        setUpdatingRequestId(null)
      }
    },
    [setRequests]
  )

  const convertRequest = useCallback(
    async (requestId: string, payload?: AdminConvertEnrollmentRequestPayload) => {
      setConvertingRequestId(requestId)
      setActionError(null)

      try {
        const updated = await adminApi.convertEnrollmentRequest(requestId, payload)
        setRequests((prev) =>
          prev.map((request) => (request.id === requestId ? updated : request))
        )
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Failed to convert enrollment request."
        setActionError(message)
        throw requestError
      } finally {
        setConvertingRequestId(null)
      }
    },
    [setRequests]
  )

  return {
    requests,
    isLoading,
    updatingRequestId,
    convertingRequestId,
    error,
    actionError,
    reload,
    updateStatus,
    convertRequest,
  }
}
