import * as React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function AdminFormGrid({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("grid gap-4", className)} {...props} />
}

type AdminFormFieldProps = {
  id: string
  label: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function AdminFormField({
  id,
  label,
  hint,
  error,
  className,
  children,
}: AdminFormFieldProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}

type AdminFormErrorProps = {
  message?: string | null
  className?: string
}

export function AdminFormError({ message, className }: AdminFormErrorProps) {
  if (!message) {
    return null
  }

  return <p className={cn("text-sm text-destructive", className)}>{message}</p>
}
