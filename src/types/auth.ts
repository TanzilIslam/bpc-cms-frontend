export const USER_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "TA",
  "STUDENT",
  "GUEST",
  "ALUMNI",
] as const

export type UserRole = (typeof USER_ROLES)[number]

export type AuthUser = {
  id: string
  email: string
  fullName: string
  role: UserRole
}
