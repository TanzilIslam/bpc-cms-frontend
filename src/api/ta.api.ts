import { z } from "zod"

import { getHttpErrorMessage, mapApiItems } from "@/api/http"
import { getWithFallback, postWithFallback } from "@/api/request"
import type {
  AttendancePayload,
  TABatch,
  TABatchStatus,
  TABatchStudent,
  TASubmission,
  TASubmissionStatus,
  GradeAssignmentPayload,
} from "@/types/ta"

const batchStatusSchema = z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"])
const submissionStatusSchema = z.enum(["SUBMITTED", "GRADED", "REVISION_NEEDED"])

const batchSchema = z.object({
  id: z.string().or(z.number()).optional(),
  batch_name: z.string().optional(),
  batchName: z.string().optional(),
  batch_code: z.string().optional(),
  batchCode: z.string().optional(),
  schedule: z.string().optional(),
  status: batchStatusSchema.optional(),
  current_enrollment: z.number().optional(),
  currentEnrollment: z.number().optional(),
  course_title: z.string().optional(),
  courseTitle: z.string().optional(),
  course: z
    .object({
      title: z.string().optional(),
    })
    .optional(),
})

const studentSchema = z.object({
  id: z.string().or(z.number()).optional(),
  full_name: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  progress_percentage: z.number().optional(),
  progressPercentage: z.number().optional(),
  enrollment: z
    .object({
      progress_percentage: z.number().optional(),
    })
    .optional(),
})

const submissionSchema = z.object({
  id: z.string().or(z.number()).optional(),
  assignment_id: z.string().or(z.number()).optional(),
  assignmentId: z.string().or(z.number()).optional(),
  assignment_title: z.string().optional(),
  assignmentTitle: z.string().optional(),
  assignment: z
    .object({
      id: z.string().or(z.number()).optional(),
      title: z.string().optional(),
    })
    .optional(),
  student_id: z.string().or(z.number()).optional(),
  studentId: z.string().or(z.number()).optional(),
  student_name: z.string().optional(),
  studentName: z.string().optional(),
  student: z
    .object({
      id: z.string().or(z.number()).optional(),
      full_name: z.string().optional(),
      fullName: z.string().optional(),
    })
    .optional(),
  submission_date: z.string().optional(),
  submissionDate: z.string().optional(),
  status: submissionStatusSchema.optional(),
  score: z.number().nullable().optional(),
  feedback: z.string().nullable().optional(),
})

function mapBatch(rawValue: unknown): TABatch {
  const raw = batchSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    batchName: raw.batch_name ?? raw.batchName ?? "Unnamed Batch",
    batchCode: raw.batch_code ?? raw.batchCode ?? "-",
    courseTitle: raw.course_title ?? raw.courseTitle ?? raw.course?.title ?? "Unknown Course",
    schedule: raw.schedule ?? "-",
    status: (raw.status ?? "UPCOMING") as TABatchStatus,
    studentCount: raw.current_enrollment ?? raw.currentEnrollment ?? 0,
  }
}

function mapBatchStudent(rawValue: unknown): TABatchStudent {
  const raw = studentSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    fullName: raw.full_name ?? raw.fullName ?? "Unknown Student",
    email: raw.email ?? "-",
    phone: raw.phone ?? "-",
    progressPercentage:
      raw.progress_percentage ??
      raw.progressPercentage ??
      raw.enrollment?.progress_percentage ??
      0,
  }
}

function mapSubmission(rawValue: unknown): TASubmission {
  const raw = submissionSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    assignmentId: String(raw.assignment_id ?? raw.assignmentId ?? raw.assignment?.id ?? ""),
    assignmentTitle:
      raw.assignment_title ??
      raw.assignmentTitle ??
      raw.assignment?.title ??
      "Untitled Assignment",
    studentId: String(raw.student_id ?? raw.studentId ?? raw.student?.id ?? ""),
    studentName:
      raw.student_name ??
      raw.studentName ??
      raw.student?.full_name ??
      raw.student?.fullName ??
      "Unknown Student",
    submittedAt: raw.submission_date ?? raw.submissionDate ?? null,
    status: (raw.status ?? "SUBMITTED") as TASubmissionStatus,
    score: raw.score ?? null,
    feedback: raw.feedback ?? null,
  }
}

export const taApi = {
  async getMyBatches(): Promise<TABatch[]> {
    try {
      const payload = await getWithFallback(["/ta/batches", "/batches"])
      return mapApiItems(payload, mapBatch)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async getBatchStudents(batchId: string): Promise<TABatchStudent[]> {
    try {
      const payload = await getWithFallback([
        `/ta/batches/${batchId}/students`,
        `/admin/batches/${batchId}/students`,
      ])
      return mapApiItems(payload, mapBatchStudent)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async markAttendance(payload: AttendancePayload): Promise<void> {
    try {
      for (const record of payload.records) {
        const body = {
          batch_id: payload.batchId,
          class_date: payload.classDate,
          class_topic: payload.classTopic,
          student_id: record.studentId,
          status: record.status,
          notes: record.notes,
        }

        await postWithFallback(["/ta/attendance", "/admin/attendance"], body)
      }
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async getSubmissionsForGrading(): Promise<TASubmission[]> {
    try {
      const payload = await getWithFallback([
        "/ta/submissions",
        "/ta/submissions/pending",
        "/admin/submissions",
      ])
      return mapApiItems(payload, mapSubmission)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async gradeAssignment(
    assignmentId: string,
    payload: GradeAssignmentPayload
  ): Promise<void> {
    const body = {
      submission_id: payload.submissionId,
      student_id: payload.studentId,
      score: payload.score,
      feedback: payload.feedback,
      status: payload.status ?? "GRADED",
    }

    try {
      const fallbackPaths = [`/ta/assignments/${assignmentId}/grade`]
      if (payload.submissionId) {
        fallbackPaths.push(`/admin/submissions/${payload.submissionId}/grade`)
      }

      await postWithFallback(fallbackPaths, body)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
