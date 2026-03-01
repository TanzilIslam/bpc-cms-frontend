import type { ReactNode } from "react"
import { AlertCircleIcon, InboxIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

type PageLoadingStateProps = {
  message?: string
  className?: string
}

export function PageLoadingState({
  message = "Loading...",
  className,
}: PageLoadingStateProps) {
  return (
    <div className={cn("flex items-center gap-2 rounded-lg border px-4 py-3 text-sm", className)}>
      <Spinner className="size-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}

type PageErrorStateProps = {
  message: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function PageErrorState({
  message,
  onRetry,
  retryLabel = "Retry",
  className,
}: PageErrorStateProps) {
  return (
    <Alert variant="destructive" className={cn("space-y-3", className)}>
      <AlertCircleIcon />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{message}</p>
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  )
}

type EmptyStatePanelProps = {
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyStatePanel({
  title,
  description,
  action,
  className,
}: EmptyStatePanelProps) {
  return (
    <Empty className={cn("rounded-lg border p-6 md:p-8", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  )
}

type InlineErrorMessageProps = {
  message?: string | null
  action?: ReactNode
  className?: string
  messageClassName?: string
}

export function InlineErrorMessage({
  message,
  action,
  className,
  messageClassName,
}: InlineErrorMessageProps) {
  if (!message) {
    return null
  }

  return (
    <div className={cn(action ? "flex flex-wrap items-center gap-2" : undefined, className)}>
      <p className={cn("text-sm text-destructive", messageClassName)}>{message}</p>
      {action ?? null}
    </div>
  )
}
