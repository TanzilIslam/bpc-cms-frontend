import { useCallback, useState } from "react"

import { certificatesApi } from "@/api/certificates.api"
import { useAsyncMutation } from "@/hooks/useAsyncState"
import type { CertificateVerification } from "@/types/certificate"

type CertificateVerificationState = {
  certificate: CertificateVerification | null
  isLoading: boolean
  error: string | null
  verify: (code: string) => Promise<void>
  clear: () => void
}

export function useCertificateVerification(): CertificateVerificationState {
  const [certificate, setCertificate] = useState<CertificateVerification | null>(null)
  const { isMutating, actionError, setActionError, runMutation } = useAsyncMutation()

  const verify = useCallback(async (code: string) => {
    try {
      await runMutation(async () => {
        const result = await certificatesApi.verifyByCode(code)
        setCertificate(result)
      }, "Failed to verify certificate.")
    } catch {
      setCertificate(null)
    }
  }, [runMutation])

  const clear = useCallback(() => {
    setCertificate(null)
    setActionError(null)
  }, [setActionError])

  return {
    certificate,
    isLoading: isMutating,
    error: actionError,
    verify,
    clear,
  }
}
