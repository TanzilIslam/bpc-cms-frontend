import axios from "axios"

import { env } from "@/config/env"
import type { AuthUser, UserRole } from "@/types/auth"

export type RegisterPayload = {
  full_name: string
  email: string
  password: string
  phone: string
  laptop_specs?: string
  internet_speed?: string
}

type LoginPayload = {
  email: string
  password: string
}

type ForgotPasswordPayload = {
  email: string
}

type ResetPasswordPayload = {
  token: string
  password: string
}

type LoginResult = {
  user: AuthUser
  accessToken: string
  refreshToken?: string | null
}

type RefreshResult = {
  accessToken: string
  refreshToken?: string | null
}

type ApiEnvelope<T> = {
  data: T
}

type AuthApiResponse = Record<string, unknown>

function extractData<T>(payload: T | ApiEnvelope<T> | AuthApiResponse): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T
  }

  return payload as T
}

function toAuthUser(input: unknown): AuthUser {
  const raw = (input ?? {}) as Record<string, unknown>
  const role = (raw.role as UserRole | undefined) ?? "STUDENT"

  return {
    id: String(raw.id ?? ""),
    email: String(raw.email ?? ""),
    fullName: String(raw.fullName ?? raw.full_name ?? ""),
    role,
  }
}

const authClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

export const authApi = {
  async register(payload: RegisterPayload): Promise<Partial<LoginResult>> {
    const response = await authClient.post("/auth/register", payload)
    const data = extractData(response.data as AuthApiResponse)

    return {
      user: data.user ? toAuthUser(data.user) : undefined,
      accessToken:
        data.accessToken !== undefined || data.access_token !== undefined
          ? String(data.accessToken ?? data.access_token)
          : undefined,
      refreshToken:
        data.refreshToken !== undefined
          ? String(data.refreshToken)
          : data.refresh_token !== undefined
            ? String(data.refresh_token)
            : null,
    }
  },

  async login(payload: LoginPayload): Promise<LoginResult> {
    const response = await authClient.post("/auth/login", payload)
    const data = extractData(response.data as AuthApiResponse)

    return {
      user: toAuthUser(data.user),
      accessToken: String(data.accessToken ?? data.access_token ?? ""),
      refreshToken:
        data.refreshToken !== undefined
          ? String(data.refreshToken)
          : data.refresh_token !== undefined
            ? String(data.refresh_token)
            : null,
    }
  },

  async refresh(refreshToken?: string | null): Promise<RefreshResult> {
    const response = await authClient.post(
      "/auth/refresh",
      refreshToken ? { refreshToken } : {}
    )
    const data = extractData(response.data as AuthApiResponse)

    return {
      accessToken: String(data.accessToken ?? data.access_token ?? ""),
      refreshToken:
        data.refreshToken !== undefined
          ? String(data.refreshToken)
          : data.refresh_token !== undefined
            ? String(data.refresh_token)
            : null,
    }
  },

  async logout(refreshToken?: string | null): Promise<void> {
    await authClient.post("/auth/logout", refreshToken ? { refreshToken } : {})
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await authClient.post("/auth/forgot-password", payload)
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await authClient.post("/auth/reset-password", payload)
  },

  async getCurrentUser(accessToken: string): Promise<AuthUser> {
    const response = await authClient.get("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const data = extractData(response.data as AuthApiResponse)
    return toAuthUser(data.user ?? data)
  },
}
