type DateLike = string | null | undefined

function parseDate(value: DateLike): Date | null {
  if (!value) {
    return null
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

export function formatDate(value: DateLike, fallback = "-"): string {
  if (!value) {
    return fallback
  }

  const date = parseDate(value)
  if (!date) {
    return value
  }

  return date.toLocaleDateString()
}

export function formatDateTime(value: DateLike, fallback = "Unknown"): string {
  if (!value) {
    return fallback
  }

  const date = parseDate(value)
  if (!date) {
    return value
  }

  return date.toLocaleString()
}

export function formatMoney(value: number): string {
  return `${value.toLocaleString("en-BD")} BDT`
}
