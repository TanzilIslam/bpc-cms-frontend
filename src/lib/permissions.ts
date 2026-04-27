import type { UserRole } from "@/types/auth"

export function canAccessRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole)
}

export function getDefaultRouteForRole(role: UserRole): string {
  if (role === "SUPER_ADMIN" || role === "ADMIN") {
    return "/admin"
  }

  if (role === "TA") {
    return "/ta"
  }

  if (role === "STUDENT") {
    return "/student"
  }

  return "/unauthorized"
}
