import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

import { useAuth } from "@/hooks/useAuth"
import { canAccessRole } from "@/lib/permissions"
import type { UserRole } from "@/types/auth"

type RoleRouteProps = {
  children: ReactNode
  allowedRoles: UserRole[]
}

export function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const user = useAuth().user

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (!canAccessRole(user.role, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
