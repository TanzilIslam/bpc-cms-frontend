import { z } from "zod"

import { apiClient } from "@/api/client"
import { getHttpErrorMessage, mapApiItems } from "@/api/http"
import type { AccessType, BatchStatus, PublicBatch } from "@/types/batch"

const batchStatusSchema = z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"])
const accessTypeSchema = z.enum(["LIVE", "RECORDED", "BOTH"])

const batchSchema = z.object({
  id: z.string().or(z.number()).optional(),
  course_id: z.string().or(z.number()).optional(),
  courseId: z.string().or(z.number()).optional(),
  course: z.object({ title: z.string().optional() }).optional(),
  course_name: z.string().optional(),
  courseName: z.string().optional(),
  batch_name: z.string().optional(),
  batchName: z.string().optional(),
  batch_code: z.string().optional(),
  batchCode: z.string().optional(),
  start_date: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  schedule: z.string().nullable().optional(),
  max_students: z.number().optional(),
  maxStudents: z.number().optional(),
  status: batchStatusSchema.optional(),
  meeting_link: z.string().nullable().optional(),
  meetingLink: z.string().nullable().optional(),
  is_free: z.boolean().optional(),
  isFree: z.boolean().optional(),
  access_type: accessTypeSchema.optional(),
  accessType: accessTypeSchema.optional(),
})

function mapBatch(rawValue: unknown): PublicBatch {
  const raw = batchSchema.parse(rawValue)
  return {
    id: String(raw.id ?? ""),
    courseId: String(raw.course_id ?? raw.courseId ?? ""),
    courseName: raw.course_name ?? raw.courseName ?? raw.course?.title ?? "",
    batchName: raw.batch_name ?? raw.batchName ?? "",
    batchCode: raw.batch_code ?? raw.batchCode ?? "",
    startDate: raw.start_date ?? raw.startDate ?? null,
    endDate: raw.end_date ?? raw.endDate ?? null,
    schedule: raw.schedule ?? null,
    maxStudents: raw.max_students ?? raw.maxStudents ?? 0,
    status: (raw.status ?? "UPCOMING") as BatchStatus,
    meetingLink: raw.meeting_link ?? raw.meetingLink ?? null,
    isFree: raw.is_free ?? raw.isFree ?? false,
    accessType: (raw.access_type ?? raw.accessType ?? "LIVE") as AccessType,
  }
}

export const batchesApi = {
  async getAll(): Promise<PublicBatch[]> {
    try {
      const response = await apiClient.get("/batches")
      return mapApiItems(response.data, mapBatch)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
