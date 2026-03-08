import type { UserRole } from "@/types/auth"
import type { AttendanceStatus } from "@/types/ta"

export type StudentProfile = {
  id: string
  email: string
  fullName: string
  phone: string | null
  role: UserRole
  status: string
  address: string | null
  lastLoginAt: string | null
}

export type StudentAttendance = {
  id: string
  batchId: string
  batchName: string
  classDate: string
  classTopic: string | null
  status: AttendanceStatus
  notes: string | null
}

export type { AttendanceStatus }
