import { z } from "zod"

import { getHttpErrorMessage, mapApiItems } from "@/api/http"
import { getWithFallback, postWithFallback } from "@/api/request"
import type {
  AssignmentDetail,
  AssignmentSubmissionPayload,
  AssignmentType,
  StudentAssignment,
  SubmissionStatus,
} from "@/types/assignment"

const submissionStatusSchema = z.enum(["SUBMITTED", "GRADED", "REVISION_NEEDED"])
const assignmentTypeSchema = z.enum(["PROJECT", "QUIZ", "CODE", "WRITTEN"])

const assignmentDetailSchema = z.object({
  id: z.string().or(z.number()).optional(),
  course_content_id: z.string().or(z.number()).optional(),
  courseContentId: z.string().or(z.number()).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  assignment_type: assignmentTypeSchema.optional(),
  assignmentType: assignmentTypeSchema.optional(),
  max_score: z.number().optional(),
  maxScore: z.number().optional(),
  due_date: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  required_files: z.array(z.string()).optional(),
  requiredFiles: z.array(z.string()).optional(),
  submission_instructions: z.string().nullable().optional(),
  submissionInstructions: z.string().nullable().optional(),
})

function mapAssignmentDetail(rawValue: unknown): AssignmentDetail {
  const raw = assignmentDetailSchema.parse(rawValue)
  return {
    id: String(raw.id ?? ""),
    courseContentId: String(raw.course_content_id ?? raw.courseContentId ?? ""),
    title: raw.title ?? "",
    description: raw.description ?? "",
    assignmentType: (raw.assignment_type ?? raw.assignmentType ?? "PROJECT") as AssignmentType,
    maxScore: raw.max_score ?? raw.maxScore ?? 100,
    dueDate: raw.due_date ?? raw.dueDate ?? null,
    requiredFiles: raw.required_files ?? raw.requiredFiles ?? [],
    submissionInstructions: raw.submission_instructions ?? raw.submissionInstructions ?? null,
  }
}

const assignmentSchema = z.object({
  id: z.string().or(z.number()).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  assignment_type: z.string().optional(),
  assignmentType: z.string().optional(),
  max_score: z.number().optional(),
  maxScore: z.number().optional(),
  due_date: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  status: submissionStatusSchema.optional(),
  submission_status: submissionStatusSchema.optional(),
  submissionStatus: submissionStatusSchema.optional(),
  score: z.number().nullable().optional(),
  feedback: z.string().nullable().optional(),
})

function mapAssignment(rawValue: unknown): StudentAssignment {
  const raw = assignmentSchema.parse(rawValue)
  const status =
    raw.status ?? raw.submission_status ?? raw.submissionStatus ?? "NOT_SUBMITTED"

  return {
    id: String(raw.id ?? ""),
    title: raw.title ?? "Untitled Assignment",
    description: raw.description ?? "",
    assignmentType: raw.assignment_type ?? raw.assignmentType ?? "PROJECT",
    maxScore: raw.max_score ?? raw.maxScore ?? 100,
    dueDate: raw.due_date ?? raw.dueDate ?? null,
    status: status as SubmissionStatus,
    score: raw.score ?? null,
    feedback: raw.feedback ?? null,
  }
}

export const assignmentsApi = {
  async getMine(): Promise<StudentAssignment[]> {
    try {
      const payload = await getWithFallback(["/students/me/assignments", "/assignments"])
      return mapApiItems(payload, mapAssignment)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async getById(assignmentId: string): Promise<AssignmentDetail> {
    try {
      const data = await getWithFallback([`/assignments/${assignmentId}`])
      return mapAssignmentDetail(data)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async submit(
    assignmentId: string,
    payload: AssignmentSubmissionPayload
  ): Promise<void> {
    try {
      await postWithFallback(
        [`/students/me/assignments/${assignmentId}/submit`, `/assignments/${assignmentId}/submit`],
        {
          filePaths: payload.filePaths,
          githubLink: payload.githubLink,
          liveDemoLink: payload.liveDemoLink,
          notes: payload.notes,
        }
      )
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
