import { create } from "zustand"
import { persist } from "zustand/middleware"

import { authApi, type RegisterPayload } from "@/api/auth.api"
import type { AuthUser } from "@/types/auth"

type SessionPayload = {
  user: AuthUser
  accessToken: string
  refreshTokenValue?: string | null
}

type AuthStore = {
  user: AuthUser | null
  accessToken: string | null
  refreshTokenValue: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  refreshAuthToken: () => Promise<void>
  initialize: () => Promise<void>
  setSession: (payload: SessionPayload) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshTokenValue: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      setSession: ({ user, accessToken, refreshTokenValue }) => {
        set({
          user,
          accessToken,
          refreshTokenValue: refreshTokenValue ?? get().refreshTokenValue,
          isAuthenticated: Boolean(accessToken),
          isLoading: false,
          isInitialized: true,
        })
      },

      clearSession: () => {
        set({
          user: null,
          accessToken: null,
          refreshTokenValue: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        })
      },

      login: async (email, password) => {
        set({ isLoading: true })

        try {
          const result = await authApi.login({ email, password })
          get().setSession({
            user: result.user,
            accessToken: result.accessToken,
            refreshTokenValue: result.refreshToken,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (payload) => {
        set({ isLoading: true })

        try {
          const result = await authApi.register(payload)

          if (result.user && result.accessToken) {
            get().setSession({
              user: result.user,
              accessToken: result.accessToken,
              refreshTokenValue: result.refreshToken ?? null,
            })
            return
          }

          await get().login(payload.email, payload.password)
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        const refreshTokenValue = get().refreshTokenValue

        if (refreshTokenValue) {
          try {
            await authApi.logout({ refreshToken: refreshTokenValue })
          } catch {
            // Ignore logout request errors and clear local session anyway.
          }
        }

        get().clearSession()
      },

      refreshAuthToken: async () => {
        const refreshTokenValue = get().refreshTokenValue

        if (!refreshTokenValue) {
          get().clearSession()
          throw new Error("Refresh token missing.")
        }

        const result = await authApi.refresh({ refreshToken: refreshTokenValue })
        set({
          accessToken: result.accessToken,
          refreshTokenValue: result.refreshToken ?? refreshTokenValue,
          isAuthenticated: Boolean(result.accessToken),
        })
      },

      initialize: async () => {
        if (get().isInitialized) {
          return
        }

        const token = get().accessToken

        if (!token) {
          set({ isLoading: false, isInitialized: true, isAuthenticated: false })
          return
        }

        set({ isLoading: true })

        try {
          const user = await authApi.getCurrentUser(token)
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          })
        } catch {
          try {
            await get().refreshAuthToken()
            const nextToken = get().accessToken

            if (!nextToken) {
              throw new Error("Missing refreshed access token.")
            }

            const user = await authApi.getCurrentUser(nextToken)
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
            })
          } catch {
            get().clearSession()
          }
        }
      },
    }),
    {
      name: "bpc-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshTokenValue: state.refreshTokenValue,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
