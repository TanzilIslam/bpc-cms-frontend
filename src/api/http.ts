import { AxiosError } from "axios"

type ApiEnvelope<T> = {
  data: T
}

export function extractApiData<T>(payload: T | ApiEnvelope<T>): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T
  }

  return payload as T
}

export function getHttpErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as
      | { message?: string | string[] }
      | undefined
    const message = responseData?.message

    if (Array.isArray(message)) {
      return message.join(", ")
    }

    if (typeof message === "string" && message.length > 0) {
      return message
    }

    return error.message || "Request failed."
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Unexpected request error."
}

function unwrapApiData(payload: unknown): unknown {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: unknown }).data
  }

  return payload
}

export function extractApiItems(payload: unknown): unknown[] {
  const source = unwrapApiData(payload)

  if (Array.isArray(source)) {
    return source
  }

  if (
    source &&
    typeof source === "object" &&
    "items" in source &&
    Array.isArray((source as { items?: unknown[] }).items)
  ) {
    return (source as { items: unknown[] }).items
  }

  return []
}

export function mapApiItems<T>(payload: unknown, mapper: (value: unknown) => T): T[] {
  return extractApiItems(payload).map((value) => mapper(value))
}
