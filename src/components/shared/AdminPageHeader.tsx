import type { ReactNode } from "react"

import { PageHeader } from "@/components/shared/PageHeader"

type AdminPageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
  contentClassName?: string
  actionsClassName?: string
}

export function AdminPageHeader({
  title,
  description,
  actions,
  className,
  contentClassName,
  actionsClassName,
}: AdminPageHeaderProps) {
  return (
    <PageHeader
      title={title}
      description={description}
      actions={actions}
      className={className}
      contentClassName={contentClassName}
      actionsClassName={actionsClassName}
    />
  )
}
