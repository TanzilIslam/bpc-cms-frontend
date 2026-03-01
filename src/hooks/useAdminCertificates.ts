import { useCallback } from "react"

import { adminApi } from "@/api/admin.api"
import { useAsyncMutation, useAsyncResource } from "@/hooks/useAsyncState"
import type { AdminCertificate, AdminGenerateCertificatePayload } from "@/types/admin"

type AdminCertificatesState = {
  certificates: AdminCertificate[]
  isLoading: boolean
  isMutating: boolean
  error: string | null
  actionError: string | null
  reload: () => Promise<void>
  generateCertificate: (payload: AdminGenerateCertificatePayload) => Promise<void>
}

export function useAdminCertificates(): AdminCertificatesState {
  const loadCertificates = useCallback(() => adminApi.getCertificates(), [])
  const { data: certificates, isLoading, error, reload } = useAsyncResource<AdminCertificate[]>(
    {
      initialData: [],
      load: loadCertificates,
      fallbackError: "Failed to load certificates.",
    }
  )
  const { isMutating, actionError, runMutation } = useAsyncMutation()

  const generateCertificate = useCallback(
    async (payload: AdminGenerateCertificatePayload) => {
      await runMutation(async () => {
        await adminApi.generateCertificate(payload)
        await reload()
      }, "Failed to generate certificate.")
    },
    [reload, runMutation]
  )

  return {
    certificates,
    isLoading,
    isMutating,
    error,
    actionError,
    reload,
    generateCertificate,
  }
}
