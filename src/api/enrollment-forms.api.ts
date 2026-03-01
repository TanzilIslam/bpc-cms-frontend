import { apiClient } from "@/api/client"
import { getHttpErrorMessage } from "@/api/http"
import type { EnrollmentFormPayload } from "@/types/enrollment-form"

export const enrollmentFormsApi = {
  async submit(payload: EnrollmentFormPayload): Promise<void> {
    try {
      await apiClient.post("/enrollment-forms", payload)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
