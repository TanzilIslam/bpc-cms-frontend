import { z } from "zod"

import { getHttpErrorMessage, mapApiItems } from "@/api/http"
import { getWithFallback } from "@/api/request"
import type { UserRole } from "@/types/auth"
import type { AttendanceStatus, StudentAttendance, StudentProfile } from "@/types/student"

const studentProfileSchema = z.object({
  id: z.string().or(z.number()).optional(),
  email: z.string().optional(),
  full_name: z.string().optional(),
  fullName: z.string().optional(),
  phone: z.string().nullable().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
  address: z.string().nullable().optional(),
  last_login_at: z.string().nullable().optional(),
  lastLoginAt: z.string().nullable().optional(),
})

const attendanceStatusSchema = z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"])

const attendanceSchema = z.object({
  id: z.string().or(z.number()).optional(),
  batch_id: z.string().or(z.number()).optional(),
  batchId: z.string().or(z.number()).optional(),
  batch_name: z.string().optional(),
  batchName: z.string().optional(),
  batch: z.object({ batch_name: z.string().optional(), batchName: z.string().optional() }).optional(),
  class_date: z.string().optional(),
  classDate: z.string().optional(),
  class_topic: z.string().nullable().optional(),
  classTopic: z.string().nullable().optional(),
  status: attendanceStatusSchema.optional(),
  notes: z.string().nullable().optional(),
})

function mapStudentAttendance(rawValue: unknown): StudentAttendance {
  const raw = attendanceSchema.parse(rawValue)
  return {
    id: String(raw.id ?? ""),
    batchId: String(raw.batch_id ?? raw.batchId ?? ""),
    batchName:
      raw.batch_name ?? raw.batchName ?? raw.batch?.batch_name ?? raw.batch?.batchName ?? "",
    classDate: raw.class_date ?? raw.classDate ?? "",
    classTopic: raw.class_topic ?? raw.classTopic ?? null,
    status: (raw.status ?? "PRESENT") as AttendanceStatus,
    notes: raw.notes ?? null,
  }
}

function mapStudentProfile(rawValue: unknown): StudentProfile {
  const raw = studentProfileSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    email: raw.email ?? "",
    fullName: raw.full_name ?? raw.fullName ?? "",
    phone: raw.phone ?? null,
    role: String(raw.role ?? "STUDENT") as UserRole,
    status: String(raw.status ?? "ACTIVE"),
    address: raw.address ?? null,
    lastLoginAt: raw.last_login_at ?? raw.lastLoginAt ?? null,
  }
}

export const studentsApi = {
  async getMe(): Promise<StudentProfile> {
    try {
      const payload = await getWithFallback(["/students/me", "/users/me"])
      return mapStudentProfile(payload)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async getAttendance(): Promise<StudentAttendance[]> {
    try {
      const payload = await getWithFallback(["/students/me/attendance"])
      return mapApiItems(payload, mapStudentAttendance)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
