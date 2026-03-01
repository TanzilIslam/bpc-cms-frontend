import { AxiosError } from "axios"

import { env } from "@/config/env"
import { apiClient } from "@/api/client"
import { healthResponseSchema, type HealthResponse } from "@/lib/api/schemas"

function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Unexpected error while fetching health status."
}

export async function fetchHealthStatus(): Promise<HealthResponse> {
  try {
    const response = await apiClient.get("/health", { baseURL: env.apiBaseUrl })
    return healthResponseSchema.parse(response.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}
