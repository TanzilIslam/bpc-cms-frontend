import type {
  AdminAnnouncementAudience,
  AdminAnnouncementPriority,
  AdminBatchStatus,
  AdminExpenseCategory,
  AdminFinancialGoalStatus,
  AdminPaymentMethod,
  AdminPaymentStatus,
  EnrollmentRequestStatus,
} from "@/types/admin"
import type { CourseDifficulty } from "@/types/course"

export type SelectOption<T extends string> = {
  value: T
  label: string
}

export const NATIVE_SELECT_CLASS_NAME = "h-10 rounded-md border bg-background px-3 text-sm"
export const NATIVE_SELECT_COMPACT_CLASS_NAME =
  "h-9 rounded-md border bg-background px-3 text-sm"
export const NATIVE_SELECT_INLINE_CLASS_NAME =
  "h-8 rounded-md border bg-background px-2 text-xs"

function buildValueLabelOptions<T extends string>(
  values: readonly T[]
): SelectOption<T>[] {
  return values.map((value) => ({ value, label: value }))
}

const courseDifficultyValues = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
] as const satisfies readonly CourseDifficulty[]
export const COURSE_DIFFICULTY_OPTIONS = buildValueLabelOptions(courseDifficultyValues)

const batchStatusValues = [
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
] as const satisfies readonly AdminBatchStatus[]
export const BATCH_STATUS_OPTIONS = buildValueLabelOptions(batchStatusValues)

const paymentStatusValues = [
  "PENDING",
  "CONFIRMED",
  "FAILED",
  "REFUNDED",
] as const satisfies readonly AdminPaymentStatus[]
export const PAYMENT_STATUS_OPTIONS = buildValueLabelOptions(paymentStatusValues)

export type PaymentFilterOption = "ALL" | AdminPaymentStatus
export const PAYMENT_FILTER_OPTIONS: SelectOption<PaymentFilterOption>[] = [
  { value: "ALL", label: "All Statuses" },
  ...PAYMENT_STATUS_OPTIONS,
]

const paymentMethodValues = [
  "CASH",
  "BKASH",
  "NAGAD",
  "BANK_TRANSFER",
] as const satisfies readonly AdminPaymentMethod[]
export const PAYMENT_METHOD_OPTIONS = buildValueLabelOptions(paymentMethodValues)

const paymentInstallmentValues = ["1", "2"] as const
export const PAYMENT_INSTALLMENT_OPTIONS =
  buildValueLabelOptions(paymentInstallmentValues)

const enrollmentRequestStatusValues = [
  "PENDING",
  "CONTACTED",
  "ENROLLED",
  "REJECTED",
] as const satisfies readonly EnrollmentRequestStatus[]
export const ENROLLMENT_REQUEST_STATUS_OPTIONS = buildValueLabelOptions(
  enrollmentRequestStatusValues
)

export type EnrollmentRequestFilterOption = "ALL" | EnrollmentRequestStatus
export const ENROLLMENT_REQUEST_FILTER_OPTIONS: SelectOption<EnrollmentRequestFilterOption>[] = [
  { value: "ALL", label: "All" },
  ...ENROLLMENT_REQUEST_STATUS_OPTIONS,
]

const announcementAudienceValues = [
  "ALL",
  "BATCH_SPECIFIC",
  "COURSE_SPECIFIC",
] as const satisfies readonly AdminAnnouncementAudience[]
export const ANNOUNCEMENT_AUDIENCE_OPTIONS =
  buildValueLabelOptions(announcementAudienceValues)

const announcementPriorityValues = [
  "LOW",
  "MEDIUM",
  "HIGH",
] as const satisfies readonly AdminAnnouncementPriority[]
export const ANNOUNCEMENT_PRIORITY_OPTIONS =
  buildValueLabelOptions(announcementPriorityValues)

export type AnnouncementFilterOption = "ALL" | "PUBLISHED" | "DRAFT"
export const ANNOUNCEMENT_FILTER_OPTIONS: SelectOption<AnnouncementFilterOption>[] = [
  { value: "ALL", label: "All" },
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Draft" },
]

const expenseCategoryValues = [
  "INTERNET",
  "ELECTRICITY",
  "EQUIPMENT",
  "MARKETING",
  "TA_PAYMENT",
  "OTHER",
] as const satisfies readonly AdminExpenseCategory[]
export const EXPENSE_CATEGORY_OPTIONS = buildValueLabelOptions(expenseCategoryValues)

const financialGoalStatusValues = [
  "ACTIVE",
  "ACHIEVED",
  "CANCELLED",
] as const satisfies readonly AdminFinancialGoalStatus[]
export const FINANCIAL_GOAL_STATUS_OPTIONS = buildValueLabelOptions(
  financialGoalStatusValues
)
