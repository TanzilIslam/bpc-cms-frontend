import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"

import { env } from "@/config/env"
import { useAuthStore } from "@/store/authStore"

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken

    if (token) {
      config.headers = config.headers ?? {}
      ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      await useAuthStore.getState().refreshAuthToken()
      const nextToken = useAuthStore.getState().accessToken

      if (nextToken) {
        originalRequest.headers = originalRequest.headers ?? {}
        ;(originalRequest.headers as Record<string, string>).Authorization =
          `Bearer ${nextToken}`
      }

      return apiClient(originalRequest)
    } catch (refreshError) {
      useAuthStore.getState().clearSession()
      return Promise.reject(refreshError)
    }
  }
)
