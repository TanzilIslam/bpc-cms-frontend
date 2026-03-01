import { useMemo, useState } from "react"

import {
  EmptyStatePanel,
  InlineErrorMessage,
  PageErrorState,
  PageLoadingState,
} from "@/components/shared/AsyncStates"
import { AdminActionButtons } from "@/components/shared/AdminActionButtons"
import { AdminDetailRow } from "@/components/shared/AdminDetailRow"
import { AdminFormError, AdminFormField, AdminFormGrid } from "@/components/shared/AdminForm"
import { AdminPageHeader } from "@/components/shared/AdminPageHeader"
import { AdminSection } from "@/components/shared/AdminSection"
import { MetricCard } from "@/components/shared/MetricCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAdminExpenses } from "@/hooks/useAdminExpenses"
import { useAdminFinancialGoals } from "@/hooks/useAdminFinancialGoals"
import { useAdminFinancialSummary } from "@/hooks/useAdminFinancialSummary"
import { useAdminPayments } from "@/hooks/useAdminPayments"
import {
  EXPENSE_CATEGORY_OPTIONS,
  FINANCIAL_GOAL_STATUS_OPTIONS,
  NATIVE_SELECT_CLASS_NAME,
} from "@/lib/admin-options"
import { financialGoalStatusBadgeVariant } from "@/lib/admin-badges"
import { formatDate, formatMoney } from "@/lib/formatters"
import type {
  AdminExpenseCategory,
  AdminFinancialGoal,
  AdminFinancialGoalStatus,
} from "@/types/admin"

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function getGoalProgress(goal: AdminFinancialGoal): number {
  if (goal.targetAmount <= 0) {
    return 0
  }

  return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
}

type ExpenseFormState = {
  expenseDate: string
  category: AdminExpenseCategory
  amount: string
  description: string
}

type GoalFormState = {
  goalName: string
  targetAmount: string
  currentAmount: string
  deadline: string
  status: AdminFinancialGoalStatus
}

const emptyExpenseForm: ExpenseFormState = {
  expenseDate: getTodayDate(),
  category: "OTHER",
  amount: "",
  description: "",
}

const emptyGoalForm: GoalFormState = {
  goalName: "",
  targetAmount: "",
  currentAmount: "0",
  deadline: "",
  status: "ACTIVE",
}

function formFromGoal(goal: AdminFinancialGoal): GoalFormState {
  return {
    goalName: goal.goalName,
    targetAmount: String(goal.targetAmount || 0),
    currentAmount: String(goal.currentAmount || 0),
    deadline: goal.deadline ? goal.deadline.slice(0, 10) : "",
    status: goal.status,
  }
}

export function AdminFinancialsPage() {
  const { summary, isLoading, error, reload } = useAdminFinancialSummary()
  const {
    payments,
    isLoading: isPaymentsLoading,
    error: paymentsError,
    reload: reloadPayments,
  } = useAdminPayments()
  const {
    expenses,
    isLoading: isExpensesLoading,
    isMutating: isExpenseMutating,
    error: expensesError,
    actionError: expenseActionError,
    reload: reloadExpenses,
    createExpense,
  } = useAdminExpenses()
  const {
    goals,
    isLoading: isGoalsLoading,
    isMutating: isGoalMutating,
    error: goalsError,
    actionError: goalActionError,
    reload: reloadGoals,
    createGoal,
    updateGoal,
  } = useAdminFinancialGoals()

  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [expenseForm, setExpenseForm] = useState<ExpenseFormState>(emptyExpenseForm)
  const [expenseFormError, setExpenseFormError] = useState<string | null>(null)
  const [goalDialogOpen, setGoalDialogOpen] = useState(false)
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  const [goalForm, setGoalForm] = useState<GoalFormState>(emptyGoalForm)
  const [goalFormError, setGoalFormError] = useState<string | null>(null)

  const recentPayments = useMemo(() => {
    return [...payments]
      .sort((a, b) => {
        if (!a.paymentDate && !b.paymentDate) {
          return 0
        }
        if (!a.paymentDate) {
          return 1
        }
        if (!b.paymentDate) {
          return -1
        }
        return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
      })
      .slice(0, 5)
  }, [payments])

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => {
        if (!a.expenseDate && !b.expenseDate) {
          return 0
        }
        if (!a.expenseDate) {
          return 1
        }
        if (!b.expenseDate) {
          return -1
        }
        return new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime()
      })
      .slice(0, 5)
  }, [expenses])

  const sortedGoals = useMemo(() => {
    const priority: Record<AdminFinancialGoalStatus, number> = {
      ACTIVE: 0,
      ACHIEVED: 1,
      CANCELLED: 2,
    }

    return [...goals].sort((a, b) => {
      const statusOrder = priority[a.status] - priority[b.status]
      if (statusOrder !== 0) {
        return statusOrder
      }

      if (!a.deadline && !b.deadline) {
        return 0
      }
      if (!a.deadline) {
        return 1
      }
      if (!b.deadline) {
        return -1
      }

      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    })
  }, [goals])

  function updateExpenseForm<K extends keyof ExpenseFormState>(
    key: K,
    value: ExpenseFormState[K]
  ) {
    setExpenseForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateGoalForm<K extends keyof GoalFormState>(key: K, value: GoalFormState[K]) {
    setGoalForm((prev) => ({ ...prev, [key]: value }))
  }

  function openExpenseDialog() {
    setExpenseForm({
      ...emptyExpenseForm,
      expenseDate: getTodayDate(),
    })
    setExpenseFormError(null)
    setExpenseDialogOpen(true)
  }

  function openCreateGoalDialog() {
    setEditingGoalId(null)
    setGoalForm(emptyGoalForm)
    setGoalFormError(null)
    setGoalDialogOpen(true)
  }

  function openEditGoalDialog(goal: AdminFinancialGoal) {
    setEditingGoalId(goal.id)
    setGoalForm(formFromGoal(goal))
    setGoalFormError(null)
    setGoalDialogOpen(true)
  }

  async function handleCreateExpense() {
    setExpenseFormError(null)

    const amount = Number(expenseForm.amount)
    if (!expenseForm.expenseDate) {
      setExpenseFormError("Expense date is required.")
      return
    }
    if (Number.isNaN(amount) || amount <= 0) {
      setExpenseFormError("Amount must be greater than 0.")
      return
    }
    if (expenseForm.description.trim().length < 3) {
      setExpenseFormError("Description must be at least 3 characters.")
      return
    }

    try {
      await createExpense({
        expenseDate: expenseForm.expenseDate,
        category: expenseForm.category,
        amount,
        description: expenseForm.description.trim(),
      })
      await reload()
      setExpenseDialogOpen(false)
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Failed to create expense."
      setExpenseFormError(message)
    }
  }

  async function handleSaveGoal() {
    setGoalFormError(null)

    const targetAmount = Number(goalForm.targetAmount)
    const currentAmount = Number(goalForm.currentAmount)

    if (goalForm.goalName.trim().length < 3) {
      setGoalFormError("Goal name must be at least 3 characters.")
      return
    }
    if (Number.isNaN(targetAmount) || targetAmount <= 0) {
      setGoalFormError("Target amount must be greater than 0.")
      return
    }
    if (Number.isNaN(currentAmount) || currentAmount < 0) {
      setGoalFormError("Current amount cannot be negative.")
      return
    }

    try {
      if (editingGoalId) {
        await updateGoal(editingGoalId, {
          goalName: goalForm.goalName.trim(),
          targetAmount,
          currentAmount,
          deadline: goalForm.deadline || undefined,
          status: goalForm.status,
        })
      } else {
        await createGoal({
          goalName: goalForm.goalName.trim(),
          targetAmount,
          currentAmount,
          deadline: goalForm.deadline || undefined,
          status: goalForm.status,
        })
      }
      setGoalDialogOpen(false)
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Failed to save goal."
      setGoalFormError(message)
    }
  }

  async function handleQuickGoalStatus(
    goal: AdminFinancialGoal,
    status: AdminFinancialGoalStatus
  ) {
    try {
      await updateGoal(goal.id, {
        status,
        currentAmount:
          status === "ACHIEVED"
            ? Math.max(goal.currentAmount, goal.targetAmount)
            : goal.currentAmount,
      })
    } catch {
      // Hook-level actionError already captures and displays the API error.
    }
  }

  if (isLoading) {
    return <PageLoadingState message="Loading financial summary..." />
  }

  if (error || !summary) {
    return (
      <PageErrorState
        message={error ?? "Failed to load financial data."}
        onRetry={() => void reload()}
      />
    )
  }

  const metrics = [
    { label: "Total Revenue", value: formatMoney(summary.totalRevenue) },
    { label: "Total Expenses", value: formatMoney(summary.totalExpenses) },
    { label: "Net Profit", value: formatMoney(summary.netProfit) },
    { label: "Pending Payments", value: summary.pendingPayments },
  ]

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Financials"
        description="Revenue, expenses, and savings goals for admin operations."
        actions={
          <>
            <Button variant="outline" onClick={openCreateGoalDialog}>
              Set Goal
            </Button>
            <Button onClick={openExpenseDialog}>Add Expense</Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>

      <InlineErrorMessage message={expenseActionError} />
      <InlineErrorMessage message={goalActionError} />

      <AdminSection
        title="Savings Goals"
        action={
          goalsError ? (
            <Button variant="outline" size="sm" onClick={() => void reloadGoals()}>
              Retry
            </Button>
          ) : undefined
        }
      >
        {isGoalsLoading ? (
          <PageLoadingState
            message="Loading financial goals..."
            className="border-dashed px-3 py-2"
          />
        ) : goalsError ? (
          <PageErrorState
            message={goalsError}
            onRetry={() => void reloadGoals()}
            className="px-3 py-2"
          />
        ) : sortedGoals.length === 0 ? (
          <EmptyStatePanel
            title="No financial goals set yet"
            description="Define a target to track savings for your center and operations."
            action={
              <Button size="sm" onClick={openCreateGoalDialog}>
                Set Goal
              </Button>
            }
            className="p-4 md:p-6"
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {sortedGoals.map((goal) => {
              const progress = getGoalProgress(goal)
              return (
                <article key={goal.id} className="space-y-3 rounded-md border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{goal.goalName}</h3>
                    <Badge variant={financialGoalStatusBadgeVariant(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatMoney(goal.currentAmount)} / {formatMoney(goal.targetAmount)} ({progress}
                      %)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Deadline: {formatDate(goal.deadline)}
                    </p>
                  </div>
                  <AdminActionButtons
                    align="end"
                    items={[
                      goal.status === "ACTIVE"
                        ? {
                            key: "mark-achieved",
                            label: "Mark Achieved",
                            variant: "secondary",
                            size: "sm",
                            disabled: isGoalMutating,
                            onClick: () => void handleQuickGoalStatus(goal, "ACHIEVED"),
                          }
                        : {
                            key: "mark-active",
                            label: "Mark Active",
                            variant: "secondary",
                            size: "sm",
                            disabled: isGoalMutating,
                            onClick: () => void handleQuickGoalStatus(goal, "ACTIVE"),
                          },
                      {
                        key: "cancel",
                        label: "Cancel",
                        variant: "outline",
                        size: "sm",
                        disabled: isGoalMutating,
                        hidden: goal.status === "CANCELLED",
                        onClick: () => void handleQuickGoalStatus(goal, "CANCELLED"),
                      },
                      {
                        key: "edit-goal",
                        label: "Edit Goal",
                        variant: "outline",
                        size: "sm",
                        disabled: isGoalMutating,
                        onClick: () => openEditGoalDialog(goal),
                      },
                    ]}
                  />
                </article>
              )
            })}
          </div>
        )}
      </AdminSection>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminSection
          title="Recent Payments"
          action={
            paymentsError ? (
              <Button variant="outline" size="sm" onClick={() => void reloadPayments()}>
                Retry
              </Button>
            ) : undefined
          }
        >
          {isPaymentsLoading ? (
            <PageLoadingState message="Loading payments..." className="border-dashed px-3 py-2" />
          ) : paymentsError ? (
            <PageErrorState
              message={paymentsError}
              onRetry={() => void reloadPayments()}
              className="px-3 py-2"
            />
          ) : recentPayments.length === 0 ? (
            <EmptyStatePanel
              title="No recent payments found"
              description="Confirmed payment records will appear here."
              className="p-4 md:p-6"
            />
          ) : (
            <div className="grid gap-2">
              {recentPayments.map((payment) => (
                <AdminDetailRow
                  key={payment.id}
                  title={payment.studentName}
                  subtitle={`${payment.paymentMethod} | ${formatDate(payment.paymentDate)}`}
                  value={formatMoney(payment.amount)}
                />
              ))}
            </div>
          )}
        </AdminSection>

        <AdminSection
          title="Recent Expenses"
          action={
            expensesError ? (
              <Button variant="outline" size="sm" onClick={() => void reloadExpenses()}>
                Retry
              </Button>
            ) : undefined
          }
        >
          {isExpensesLoading ? (
            <PageLoadingState message="Loading expenses..." className="border-dashed px-3 py-2" />
          ) : expensesError ? (
            <PageErrorState
              message={expensesError}
              onRetry={() => void reloadExpenses()}
              className="px-3 py-2"
            />
          ) : recentExpenses.length === 0 ? (
            <EmptyStatePanel
              title="No expense records found"
              description="Operational expenses you add will appear here."
              className="p-4 md:p-6"
            />
          ) : (
            <div className="grid gap-2">
              {recentExpenses.map((expense) => (
                <AdminDetailRow
                  key={expense.id}
                  title={expense.category}
                  subtitle={`${expense.description} | ${formatDate(expense.expenseDate)}`}
                  value={formatMoney(expense.amount)}
                />
              ))}
            </div>
          )}
        </AdminSection>
      </div>

      <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>Record an operational expense for financial tracking.</DialogDescription>
          </DialogHeader>

          <AdminFormGrid>
            <AdminFormField id="expense-date" label="Expense Date">
              <Input
                id="expense-date"
                type="date"
                value={expenseForm.expenseDate}
                onChange={(event) => updateExpenseForm("expenseDate", event.target.value)}
              />
            </AdminFormField>

            <div className="grid gap-3 md:grid-cols-2">
              <AdminFormField id="expense-category" label="Category">
                <select
                  id="expense-category"
                  aria-label="Expense category"
                  value={expenseForm.category}
                  onChange={(event) =>
                    updateExpenseForm("category", event.target.value as AdminExpenseCategory)
                  }
                  className={NATIVE_SELECT_CLASS_NAME}
                >
                  {EXPENSE_CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </AdminFormField>
              <AdminFormField id="expense-amount" label="Amount (BDT)">
                <Input
                  id="expense-amount"
                  type="number"
                  min={1}
                  value={expenseForm.amount}
                  onChange={(event) => updateExpenseForm("amount", event.target.value)}
                />
              </AdminFormField>
            </div>

            <AdminFormField id="expense-description" label="Description">
              <Textarea
                id="expense-description"
                rows={3}
                value={expenseForm.description}
                onChange={(event) => updateExpenseForm("description", event.target.value)}
              />
            </AdminFormField>

            <AdminFormError message={expenseFormError} />
          </AdminFormGrid>

          <DialogFooter showCloseButton>
            <Button onClick={() => void handleCreateExpense()} disabled={isExpenseMutating}>
              {isExpenseMutating ? "Saving..." : "Save Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingGoalId ? "Edit Goal" : "Set Financial Goal"}</DialogTitle>
            <DialogDescription>
              Configure savings targets and track progress over time.
            </DialogDescription>
          </DialogHeader>

          <AdminFormGrid>
            <AdminFormField id="goal-name" label="Goal Name">
              <Input
                id="goal-name"
                value={goalForm.goalName}
                onChange={(event) => updateGoalForm("goalName", event.target.value)}
              />
            </AdminFormField>

            <div className="grid gap-3 md:grid-cols-2">
              <AdminFormField id="goal-target" label="Target Amount (BDT)">
                <Input
                  id="goal-target"
                  type="number"
                  min={1}
                  value={goalForm.targetAmount}
                  onChange={(event) => updateGoalForm("targetAmount", event.target.value)}
                />
              </AdminFormField>
              <AdminFormField id="goal-current" label="Current Amount (BDT)">
                <Input
                  id="goal-current"
                  type="number"
                  min={0}
                  value={goalForm.currentAmount}
                  onChange={(event) => updateGoalForm("currentAmount", event.target.value)}
                />
              </AdminFormField>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <AdminFormField id="goal-deadline" label="Deadline">
                <Input
                  id="goal-deadline"
                  type="date"
                  value={goalForm.deadline}
                  onChange={(event) => updateGoalForm("deadline", event.target.value)}
                />
              </AdminFormField>
              <AdminFormField id="goal-status" label="Status">
                <select
                  id="goal-status"
                  aria-label="Goal status"
                  value={goalForm.status}
                  onChange={(event) =>
                    updateGoalForm("status", event.target.value as AdminFinancialGoalStatus)
                  }
                  className={NATIVE_SELECT_CLASS_NAME}
                >
                  {FINANCIAL_GOAL_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </AdminFormField>
            </div>

            <AdminFormError message={goalFormError} />
          </AdminFormGrid>

          <DialogFooter showCloseButton>
            <Button onClick={() => void handleSaveGoal()} disabled={isGoalMutating}>
              {isGoalMutating ? "Saving..." : editingGoalId ? "Update Goal" : "Create Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
