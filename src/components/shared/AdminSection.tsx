import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type AdminSectionProps = {
  title: ReactNode
  action?: ReactNode
  className?: string
  headerClassName?: string
  titleClassName?: string
  children: ReactNode
}

export function AdminSection({
  title,
  action,
  className,
  headerClassName,
  titleClassName,
  children,
}: AdminSectionProps) {
  return (
    <section className={cn("space-y-3 rounded-lg border p-4", className)}>
      <div className={cn("flex items-center justify-between", headerClassName)}>
        <h2 className={cn("text-lg font-semibold", titleClassName)}>{title}</h2>
        {action ? <div className="flex items-center gap-2">{action}</div> : null}
      </div>
      {children}
    </section>
  )
}
