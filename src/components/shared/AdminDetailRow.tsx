import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type AdminDetailRowProps = {
  title: ReactNode
  subtitle?: ReactNode
  value: ReactNode
  className?: string
}

export function AdminDetailRow({ title, subtitle, value, className }: AdminDetailRowProps) {
  return (
    <div className={cn("flex items-center justify-between rounded-md border px-3 py-2 text-sm", className)}>
      <div>
        <p className="font-medium">{title}</p>
        {subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
      </div>
      <p className="font-semibold">{value}</p>
    </div>
  )
}
