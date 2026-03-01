import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

import { useAuth } from "@/hooks/useAuth"

type ProtectedRouteProps = {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, isInitialized, isLoading } = useAuth()

  if (!isInitialized || isLoading) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-xl items-center justify-center text-sm text-muted-foreground">
        Checking authentication...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}
