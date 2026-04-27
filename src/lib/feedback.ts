export function withFallbackMessage(
  message: string | null | undefined,
  fallback: string
): string {
  if (typeof message === "string" && message.trim().length > 0) {
    return message
  }

  return fallback
}
