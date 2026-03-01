import { z } from "zod"

const envSchema = z.object({
  VITE_API_URL: z.string().min(1).optional(),
  VITE_API_BASE_URL: z.string().min(1).optional(),
  VITE_APP_NAME: z.string().min(1).optional(),
})

const parsedEnv = envSchema.safeParse(import.meta.env)

const values = parsedEnv.success ? parsedEnv.data : {}
const apiUrl = values.VITE_API_URL ?? values.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1"
const apiBaseUrl =
  values.VITE_API_BASE_URL ??
  apiUrl.replace(/\/api\/v1\/?$/i, "")

export const env = {
  apiUrl,
  apiBaseUrl,
  appName: values.VITE_APP_NAME ?? "Bhola Programming Club",
} as const
