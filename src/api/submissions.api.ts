import { z } from "zod"

import { getHttpErrorMessage } from "@/api/http"
import { getWithFallback } from "@/api/request"
import type { SubmissionDetail, SubmissionStatus } from "@/types/assignment"

const submissionStatusSchema = z.enum(["SUBMITTED", "GRADED", "REVISION_NEEDED"])

const submissionDetailSchema = z.object({
  id: z.string().or(z.number()).optional(),
  assignment_id: z.string().or(z.number()).optional(),
  assignmentId: z.string().or(z.number()).optional(),
  assignment_title: z.string().optional(),
  assignmentTitle: z.string().optional(),
  assignment: z.object({ title: z.string().optional() }).optional(),
  student_id: z.string().or(z.number()).optional(),
  studentId: z.string().or(z.number()).optional(),
  student_name: z.string().optional(),
  studentName: z.string().optional(),
  student: z.object({ full_name: z.string().optional(), fullName: z.string().optional() }).optional(),
  file_paths: z.array(z.string()).optional(),
  filePaths: z.array(z.string()).optional(),
  github_link: z.string().nullable().optional(),
  githubLink: z.string().nullable().optional(),
  live_demo_link: z.string().nullable().optional(),
  liveDemoLink: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  submitted_at: z.string().nullable().optional(),
  submittedAt: z.string().nullable().optional(),
  status: submissionStatusSchema.optional(),
  score: z.number().or(z.string()).nullable().optional(),
  feedback: z.string().nullable().optional(),
  graded_by: z.string().nullable().optional(),
  gradedBy: z.string().nullable().optional(),
  graded_at: z.string().nullable().optional(),
  gradedAt: z.string().nullable().optional(),
})

function mapSubmissionDetail(rawValue: unknown): SubmissionDetail {
  const raw = submissionDetailSchema.parse(rawValue)
  return {
    id: String(raw.id ?? ""),
    assignmentId: String(raw.assignment_id ?? raw.assignmentId ?? ""),
    assignmentTitle:
      raw.assignment_title ?? raw.assignmentTitle ?? raw.assignment?.title ?? "",
    studentId: String(raw.student_id ?? raw.studentId ?? ""),
    studentName:
      raw.student_name ??
      raw.studentName ??
      raw.student?.full_name ??
      raw.student?.fullName ??
      "",
    filePaths: raw.file_paths ?? raw.filePaths ?? [],
    githubLink: raw.github_link ?? raw.githubLink ?? null,
    liveDemoLink: raw.live_demo_link ?? raw.liveDemoLink ?? null,
    notes: raw.notes ?? null,
    submittedAt: raw.submitted_at ?? raw.submittedAt ?? null,
    status: (raw.status ?? "SUBMITTED") as SubmissionStatus,
    score: raw.score !== null && raw.score !== undefined ? Number(raw.score) : null,
    feedback: raw.feedback ?? null,
    gradedBy: raw.graded_by ?? raw.gradedBy ?? null,
    gradedAt: raw.graded_at ?? raw.gradedAt ?? null,
  }
}

export const submissionsApi = {
  async getById(submissionId: string): Promise<SubmissionDetail> {
    try {
      const data = await getWithFallback([`/submissions/${submissionId}`])
      return mapSubmissionDetail(data)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
