import { useAuthStore } from "@/store/authStore"

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const logout = useAuthStore((state) => state.logout)
  const refreshAuthToken = useAuthStore((state) => state.refreshAuthToken)
  const initialize = useAuthStore((state) => state.initialize)

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    refreshAuthToken,
    initialize,
  }
}
