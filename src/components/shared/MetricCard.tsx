import * as React from "react"

import { cn } from "@/lib/utils"

type MetricCardProps = {
  label: React.ReactNode
  value: React.ReactNode
  className?: string
  labelClassName?: string
  valueClassName?: string
}

export function MetricCard({
  label,
  value,
  className,
  labelClassName,
  valueClassName,
}: MetricCardProps) {
  return (
    <article className={cn("rounded-lg border p-4", className)}>
      <p className={cn("text-sm text-muted-foreground", labelClassName)}>{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold", valueClassName)}>{value}</p>
    </article>
  )
}
