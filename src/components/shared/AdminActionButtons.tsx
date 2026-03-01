import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ButtonVariant = React.ComponentProps<typeof Button>["variant"]
type ButtonSize = React.ComponentProps<typeof Button>["size"]

type AdminActionButtonItem = {
  key: string
  label: ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  hidden?: boolean
}

type AdminActionButtonsProps = {
  items: AdminActionButtonItem[]
  className?: string
  align?: "start" | "end"
}

export function AdminActionButtons({
  items,
  className,
  align = "start",
}: AdminActionButtonsProps) {
  const visibleItems = items.filter((item) => !item.hidden)

  if (visibleItems.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        align === "end" ? "justify-end" : undefined,
        className
      )}
    >
      {visibleItems.map((item) => (
        <Button
          key={item.key}
          type="button"
          variant={item.variant}
          size={item.size}
          disabled={item.disabled}
          onClick={item.onClick}
        >
          {item.label}
        </Button>
      ))}
    </div>
  )
}
