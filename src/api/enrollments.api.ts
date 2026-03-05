import { z } from "zod"

import { apiClient } from "@/api/client"
import { getHttpErrorMessage, mapApiItems } from "@/api/http"
import type { StudentEnrollment, StudentProgress } from "@/types/enrollment"

const statusSchema = z.enum(["PENDING", "ACTIVE", "COMPLETED", "DROPPED", "SUSPENDED"])
const paymentStatusSchema = z.enum(["UNPAID", "PARTIAL", "FULL"])

const enrollmentSchema = z.object({
  id: z.string().or(z.number()).optional(),
  course_id: z.string().optional(),
  courseId: z.string().optional(),
  enrollment_status: statusSchema.optional(),
  enrollmentStatus: statusSchema.optional(),
  payment_status: paymentStatusSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
  progress_percentage: z.number().optional(),
  progressPercentage: z.number().optional(),
  amount_paid: z.number().or(z.string()).optional(),
  amountPaid: z.number().or(z.string()).optional(),
  total_fee: z.number().or(z.string()).optional(),
  totalFee: z.number().or(z.string()).optional(),
  batch_name: z.string().optional(),
  batchName: z.string().optional(),
  batch: z
    .object({
      batch_name: z.string().optional(),
      batchName: z.string().optional(),
    })
    .optional(),
  course: z
    .object({
      id: z.string().or(z.number()).optional(),
      title: z.string().optional(),
      slug: z.string().optional(),
    })
    .optional(),
  course_title: z.string().optional(),
  courseTitle: z.string().optional(),
  course_slug: z.string().optional(),
  courseSlug: z.string().optional(),
})


const progressItemSchema = z.object({
  enrollment_id: z.string().or(z.number()).optional(),
  enrollmentId: z.string().or(z.number()).optional(),
  course_id: z.string().or(z.number()).optional(),
  courseId: z.string().or(z.number()).optional(),
  progress_percentage: z.number().optional(),
  progressPercentage: z.number().optional(),
})

const progressSchema = z.object({
  overall_progress: z.number().optional(),
  overallProgress: z.number().optional(),
  courses: z.array(progressItemSchema).optional(),
})

function mapStudentProgress(rawValue: unknown): StudentProgress {
  const raw = progressSchema.parse(rawValue)

  return {
    overallProgress: raw.overall_progress ?? raw.overallProgress ?? 0,
    courses: (raw.courses ?? []).map((item) => ({
      enrollmentId: String(item.enrollment_id ?? item.enrollmentId ?? ""),
      courseId: String(item.course_id ?? item.courseId ?? ""),
      progressPercentage: item.progress_percentage ?? item.progressPercentage ?? 0,
    })),
  }
}

function mapEnrollment(rawValue: unknown): StudentEnrollment {
  const raw = enrollmentSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    courseId: String(raw.course_id ?? raw.courseId ?? raw.course?.id ?? ""),
    courseTitle: raw.course_title ?? raw.courseTitle ?? raw.course?.title ?? "Untitled Course",
    courseSlug: raw.course_slug ?? raw.courseSlug ?? raw.course?.slug ?? "",
    batchName: raw.batch_name ?? raw.batchName ?? raw.batch?.batch_name ?? raw.batch?.batchName ?? "-",
    enrollmentStatus:
      raw.enrollment_status ?? raw.enrollmentStatus ?? "PENDING",
    paymentStatus: raw.payment_status ?? raw.paymentStatus ?? "UNPAID",
    progressPercentage:
      raw.progress_percentage ?? raw.progressPercentage ?? 0,
    amountPaid: Number(raw.amount_paid ?? raw.amountPaid ?? 0),
    totalFee: Number(raw.total_fee ?? raw.totalFee ?? 0),
  }
}

export const enrollmentsApi = {
  async getMine(): Promise<StudentEnrollment[]> {
    try {
      const response = await apiClient.get("/students/me/enrollments")
      return mapApiItems(response.data, mapEnrollment)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async getMyProgress(): Promise<StudentProgress> {
    try {
      const response = await apiClient.get("/students/me/progress")
      return mapStudentProgress(response.data)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
