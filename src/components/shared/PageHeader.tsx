import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  className?: string
  contentClassName?: string
  actionsClassName?: string
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  contentClassName,
  actionsClassName,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3", className)}>
      <div className={cn("space-y-1", contentClassName)}>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? (
        <div className={cn("flex flex-wrap items-center gap-2", actionsClassName)}>{actions}</div>
      ) : null}
    </div>
  )
}
