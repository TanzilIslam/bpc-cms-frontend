import axios from "axios"

import { env } from "@/config/env"
import type { AuthUser, UserRole } from "@/types/auth"

export type RegisterPayload = {
  fullName: string
  email: string
  password: string
  phone: string
  address?: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type LogoutPayload = {
  refreshToken: string
}

export type ForgotPasswordPayload = {
  email: string
}

export type ResetPasswordPayload = {
  token: string
  newPassword: string
}

type LoginResult = {
  user: AuthUser
  accessToken: string
  refreshToken?: string | null
}

export type RefreshTokenPayload = {
  refreshToken: string
}

type ActionMessageResult = {
  message: string
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
      user: toAuthUser(data.user ?? data),
      accessToken: String(data.accessToken ?? data.access_token ?? ""),
      refreshToken:
        data.refreshToken !== undefined
          ? String(data.refreshToken)
          : data.refresh_token !== undefined
            ? String(data.refresh_token)
            : null,
    }
  },

  async refresh(payload: RefreshTokenPayload): Promise<RefreshResult> {
    const response = await authClient.post("/auth/refresh-token", payload)
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

  async logout(payload: LogoutPayload): Promise<void> {
    await authClient.post("/auth/logout", payload)
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<ActionMessageResult> {
    const response = await authClient.post("/auth/forgot-password", payload)
    const data = extractData(response.data as AuthApiResponse)

    return {
      message: String(data.message ?? "Password reset token sent if account exists"),
    }
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<ActionMessageResult> {
    const response = await authClient.post("/auth/reset-password", payload)
    const data = extractData(response.data as AuthApiResponse)

    return {
      message: String(data.message ?? "Password has been reset"),
    }
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
