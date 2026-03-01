import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type AdminListCardProps = {
  title: ReactNode
  subtitle?: ReactNode
  headerRight?: ReactNode
  body?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  className?: string
}

export function AdminListCard({
  title,
  subtitle,
  headerRight,
  body,
  meta,
  actions,
  className,
}: AdminListCardProps) {
  return (
    <article className={cn("space-y-3 rounded-lg border p-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {headerRight ? <div className="flex items-center gap-2">{headerRight}</div> : null}
      </div>
      {body}
      {meta}
      {actions ? <div className="flex justify-end">{actions}</div> : null}
    </article>
  )
}
