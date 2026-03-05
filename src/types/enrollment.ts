export type EnrollmentPaymentStatus = "UNPAID" | "PARTIAL" | "FULL"
export type EnrollmentStatus =
  | "PENDING"
  | "ACTIVE"
  | "COMPLETED"
  | "DROPPED"
  | "SUSPENDED"

export type StudentEnrollment = {
  id: string
  courseId: string
  courseTitle: string
  courseSlug: string
  batchName: string
  enrollmentStatus: EnrollmentStatus
  paymentStatus: EnrollmentPaymentStatus
  progressPercentage: number
  amountPaid: number
  totalFee: number
}

export type StudentCourseProgress = {
  enrollmentId: string
  courseId: string
  progressPercentage: number
}

export type StudentProgress = {
  overallProgress: number
  courses: StudentCourseProgress[]
}
