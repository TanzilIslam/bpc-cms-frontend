import { z } from "zod"

import { apiClient } from "@/api/client"
import { extractApiData, getHttpErrorMessage } from "@/api/http"
import type { UserRole } from "@/types/auth"
import type { UpdateMyProfilePayload, UserProfile, UserStatus } from "@/types/user"

const userProfileSchema = z.object({
  id: z.string().or(z.number()).optional(),
  email: z.string().optional(),
  full_name: z.string().optional(),
  fullName: z.string().optional(),
  phone: z.string().nullable().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
  address: z.string().nullable().optional(),
  laptop_specs: z.string().nullable().optional(),
  laptopSpecs: z.string().nullable().optional(),
  internet_speed: z.string().nullable().optional(),
  internetSpeed: z.string().nullable().optional(),
  date_of_birth: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  avatar_path: z.string().nullable().optional(),
  avatarPath: z.string().nullable().optional(),
  last_login_at: z.string().nullable().optional(),
  lastLoginAt: z.string().nullable().optional(),
  created_at: z.string().optional(),
  createdAt: z.string().optional(),
})

function mapUserProfile(rawValue: unknown): UserProfile {
  const raw = userProfileSchema.parse(rawValue)
  return {
    id: String(raw.id ?? ""),
    email: raw.email ?? "",
    fullName: raw.full_name ?? raw.fullName ?? "",
    phone: raw.phone ?? null,
    role: String(raw.role ?? "STUDENT") as UserRole,
    status: (raw.status ?? "ACTIVE") as UserStatus,
    address: raw.address ?? null,
    laptopSpecs: raw.laptop_specs ?? raw.laptopSpecs ?? null,
    internetSpeed: raw.internet_speed ?? raw.internetSpeed ?? null,
    dateOfBirth: raw.date_of_birth ?? raw.dateOfBirth ?? null,
    avatarPath: raw.avatar_path ?? raw.avatarPath ?? null,
    lastLoginAt: raw.last_login_at ?? raw.lastLoginAt ?? null,
    createdAt: raw.created_at ?? raw.createdAt ?? "",
  }
}

export const usersApi = {
  async getMe(): Promise<UserProfile> {
    try {
      const response = await apiClient.get("/users/me")
      return mapUserProfile(extractApiData(response.data))
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async updateMe(payload: UpdateMyProfilePayload): Promise<UserProfile> {
    try {
      const response = await apiClient.put("/users/me", payload)
      return mapUserProfile(extractApiData(response.data))
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await apiClient.post("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      const data = extractApiData(response.data) as
        | { avatarPath?: string; avatar_path?: string }
        | undefined
      return data?.avatarPath ?? data?.avatar_path ?? ""
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
