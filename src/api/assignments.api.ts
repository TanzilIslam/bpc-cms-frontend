import { z } from "zod"

import { apiClient } from "@/api/client"
import { getHttpErrorMessage, mapApiItems } from "@/api/http"
import { getWithFallback } from "@/api/request"
import type {
  AssignmentSubmissionPayload,
  StudentAssignment,
  SubmissionStatus,
} from "@/types/assignment"

const submissionStatusSchema = z.enum(["SUBMITTED", "GRADED", "REVISION_NEEDED"])

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

  async submit(
    assignmentId: string,
    payload: AssignmentSubmissionPayload
  ): Promise<void> {
    try {
      const formData = new FormData()

      if (payload.githubLink) {
        formData.append("github_link", payload.githubLink)
      }

      if (payload.liveDemoLink) {
        formData.append("live_demo_link", payload.liveDemoLink)
      }

      if (payload.notes) {
        formData.append("notes", payload.notes)
      }

      for (const file of payload.files ?? []) {
        formData.append("files", file)
      }

      await apiClient.post(`/assignments/${assignmentId}/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
