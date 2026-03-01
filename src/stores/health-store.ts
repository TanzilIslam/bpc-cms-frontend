import { create } from "zustand"

import { fetchHealthStatus } from "@/lib/api/health"
import type { HealthResponse } from "@/lib/api/schemas"

type HealthStore = {
  health: HealthResponse | null
  isLoading: boolean
  error: string | null
  checkHealth: () => Promise<void>
}

export const useHealthStore = create<HealthStore>((set) => ({
  health: null,
  isLoading: false,
  error: null,
  checkHealth: async () => {
    set({ isLoading: true, error: null })

    try {
      const health = await fetchHealthStatus()
      set({ health, isLoading: false })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch health status."
      set({ error: message, isLoading: false })
    }
  },
}))
