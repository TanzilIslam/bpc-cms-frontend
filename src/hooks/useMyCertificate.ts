import { useCallback } from "react"

import { certificatesApi } from "@/api/certificates.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { StudentCertificate } from "@/types/certificate"

type MyCertificateState = {
  certificate: StudentCertificate | null
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useMyCertificate(): MyCertificateState {
  const loadCertificate = useCallback(() => certificatesApi.getMine(), [])
  const { data: certificate, isLoading, error, reload } =
    useAsyncResource<StudentCertificate | null>({
      initialData: null,
      load: loadCertificate,
      fallbackError: "Failed to load your certificate.",
    })

  return { certificate, isLoading, error, reload }
}
