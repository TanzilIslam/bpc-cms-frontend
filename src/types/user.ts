import type { UserRole } from "@/types/auth"

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED"

export type UserProfile = {
  id: string
  email: string
  fullName: string
  phone: string | null
  role: UserRole
  status: UserStatus
  address: string | null
  laptopSpecs: string | null
  internetSpeed: string | null
  dateOfBirth: string | null
  avatarPath: string | null
  lastLoginAt: string | null
  createdAt: string
}

export type UpdateMyProfilePayload = {
  fullName?: string
  phone?: string
  address?: string
  laptopSpecs?: string
  internetSpeed?: string
  dateOfBirth?: string
}
