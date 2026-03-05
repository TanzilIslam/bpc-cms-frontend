import { useCallback } from "react"

import { certificatesApi } from "@/api/certificates.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { StudentCertificate } from "@/types/certificate"

type MyCertificateState = {
  certificates: StudentCertificate[]
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useMyCertificate(): MyCertificateState {
  const loadCertificate = useCallback(() => certificatesApi.getMine(), [])
  const { data: certificates, isLoading, error, reload } =
    useAsyncResource<StudentCertificate[]>({
      initialData: [],
      load: loadCertificate,
      fallbackError: "Failed to load your certificate.",
    })

  return { certificates, isLoading, error, reload }
}
