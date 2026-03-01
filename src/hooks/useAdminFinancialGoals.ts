import { useCallback } from "react"

import { adminApi } from "@/api/admin.api"
import { useAsyncMutation, useAsyncResource } from "@/hooks/useAsyncState"
import type {
  AdminCreateFinancialGoalPayload,
  AdminFinancialGoal,
  AdminUpdateFinancialGoalPayload,
} from "@/types/admin"

type AdminFinancialGoalsState = {
  goals: AdminFinancialGoal[]
  isLoading: boolean
  isMutating: boolean
  error: string | null
  actionError: string | null
  reload: () => Promise<void>
  createGoal: (payload: AdminCreateFinancialGoalPayload) => Promise<void>
  updateGoal: (goalId: string, payload: AdminUpdateFinancialGoalPayload) => Promise<void>
}

export function useAdminFinancialGoals(): AdminFinancialGoalsState {
  const loadGoals = useCallback(() => adminApi.getFinancialGoals(), [])
  const { data: goals, isLoading, error, reload } = useAsyncResource<AdminFinancialGoal[]>({
    initialData: [],
    load: loadGoals,
    fallbackError: "Failed to load financial goals.",
  })
  const { isMutating, actionError, runMutation } = useAsyncMutation()

  const createGoal = useCallback(
    async (payload: AdminCreateFinancialGoalPayload) => {
      await runMutation(async () => {
        await adminApi.createFinancialGoal(payload)
        await reload()
      }, "Failed to create financial goal.")
    },
    [reload, runMutation]
  )

  const updateGoal = useCallback(
    async (goalId: string, payload: AdminUpdateFinancialGoalPayload) => {
      await runMutation(async () => {
        await adminApi.updateFinancialGoal(goalId, payload)
        await reload()
      }, "Failed to update financial goal.")
    },
    [reload, runMutation]
  )

  return {
    goals,
    isLoading,
    isMutating,
    error,
    actionError,
    reload,
    createGoal,
    updateGoal,
  }
}
