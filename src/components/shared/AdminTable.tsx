import * as React from "react"

import { cn } from "@/lib/utils"

type AdminTableProps = React.ComponentProps<"table"> & {
  minWidthClass: string
}

export function AdminTable({
  minWidthClass,
  className,
  children,
  ...props
}: AdminTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className={cn("w-full text-sm", minWidthClass, className)} {...props}>
        {children}
      </table>
    </div>
  )
}

export function AdminTableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return <thead className={cn("bg-muted/50 text-left", className)} {...props} />
}

export function AdminTableBody(props: React.ComponentProps<"tbody">) {
  return <tbody {...props} />
}

export function AdminTableRow({
  className,
  ...props
}: React.ComponentProps<"tr">) {
  return <tr className={cn("border-t", className)} {...props} />
}

export function AdminTableHeadCell({
  className,
  ...props
}: React.ComponentProps<"th">) {
  return <th className={cn("px-4 py-3", className)} {...props} />
}

export function AdminTableCell({
  className,
  ...props
}: React.ComponentProps<"td">) {
  return <td className={cn("px-4 py-3", className)} {...props} />
}
