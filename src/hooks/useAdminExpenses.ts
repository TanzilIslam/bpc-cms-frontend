import { useCallback } from "react"

import { adminApi } from "@/api/admin.api"
import { useAsyncMutation, useAsyncResource } from "@/hooks/useAsyncState"
import type { AdminCreateExpensePayload, AdminExpense } from "@/types/admin"

type AdminExpensesState = {
  expenses: AdminExpense[]
  isLoading: boolean
  isMutating: boolean
  error: string | null
  actionError: string | null
  reload: () => Promise<void>
  createExpense: (payload: AdminCreateExpensePayload) => Promise<void>
}

export function useAdminExpenses(): AdminExpensesState {
  const loadExpenses = useCallback(() => adminApi.getExpenses(), [])
  const { data: expenses, isLoading, error, reload } = useAsyncResource<AdminExpense[]>({
    initialData: [],
    load: loadExpenses,
    fallbackError: "Failed to load expenses.",
  })
  const { isMutating, actionError, runMutation } = useAsyncMutation()

  const createExpense = useCallback(
    async (payload: AdminCreateExpensePayload) => {
      await runMutation(async () => {
        await adminApi.createExpense(payload)
        await reload()
      }, "Failed to create expense.")
    },
    [reload, runMutation]
  )

  return {
    expenses,
    isLoading,
    isMutating,
    error,
    actionError,
    reload,
    createExpense,
  }
}
