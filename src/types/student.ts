import type { UserRole } from "@/types/auth"

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
