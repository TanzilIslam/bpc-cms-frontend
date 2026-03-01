import type {
  AdminBatchStatus,
  AdminFinancialGoalStatus,
  AdminPaymentStatus,
  EnrollmentRequestStatus,
} from "@/types/admin"

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link"

export function publishedBadgeVariant(isPublished: boolean): BadgeVariant {
  return isPublished ? "default" : "secondary"
}

export function verificationBadgeVariant(isVerified: boolean): BadgeVariant {
  return isVerified ? "default" : "secondary"
}

export function activeStateBadgeVariant(isActive: boolean): BadgeVariant {
  return isActive ? "default" : "secondary"
}

export function approvedBadgeVariant(isApproved: boolean): BadgeVariant {
  return isApproved ? "default" : "secondary"
}

export function featuredBadgeVariant(isFeatured: boolean): BadgeVariant {
  return isFeatured ? "default" : "outline"
}

export function paymentStatusBadgeVariant(status: AdminPaymentStatus): BadgeVariant {
  if (status === "CONFIRMED") {
    return "default"
  }

  if (status === "PENDING") {
    return "secondary"
  }

  return "outline"
}

export function financialGoalStatusBadgeVariant(
  status: AdminFinancialGoalStatus
): BadgeVariant {
  if (status === "ACTIVE") {
    return "default"
  }

  if (status === "ACHIEVED") {
    return "secondary"
  }

  return "outline"
}

export function batchStatusBadgeVariant(status: AdminBatchStatus): BadgeVariant {
  void status
  return "secondary"
}

export function enrollmentRequestStatusBadgeVariant(
  status: EnrollmentRequestStatus
): BadgeVariant {
  void status
  return "secondary"
}
