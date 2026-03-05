import { z } from "zod"

import { getHttpErrorMessage } from "@/api/http"
import { getWithFallback } from "@/api/request"
import type { UserRole } from "@/types/auth"
import type { StudentProfile } from "@/types/student"

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
}
