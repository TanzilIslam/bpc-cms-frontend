import { useMemo, useState } from "react"

import { EmptyStatePanel, PageErrorState, PageLoadingState } from "@/components/shared/AsyncStates"
import { AdminPageHeader } from "@/components/shared/AdminPageHeader"
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHeadCell,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/shared/AdminTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAdminStudents } from "@/hooks/useAdminStudents"
import { activeStateBadgeVariant } from "@/lib/admin-badges"
import { formatDate } from "@/lib/formatters"

export function AdminStudentsPage() {
  const { students, isLoading, error, reload } = useAdminStudents()
  const [search, setSearch] = useState("")

  const filteredStudents = useMemo(() => {
    if (search.trim().length === 0) {
      return students
    }

    const q = search.toLowerCase()
    return students.filter(
      (student) =>
        student.fullName.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        student.phone.toLowerCase().includes(q)
    )
  }, [search, students])

  if (isLoading) {
    return <PageLoadingState message="Loading students..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  return (
    <section className="space-y-4">
      <AdminPageHeader
        title="Students"
        actions={
          <Input
            className="w-full max-w-xs"
            placeholder="Search name/email/phone"
            aria-label="Search students"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        }
      />

      {filteredStudents.length === 0 ? (
        <EmptyStatePanel
          title="No students found"
          description={
            search.trim().length > 0
              ? "No student matched your search. Try another keyword."
              : "Students will appear here after enrollment."
          }
          action={
            search.trim().length > 0 ? (
              <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                Clear Search
              </Button>
            ) : undefined
          }
        />
      ) : (
        <AdminTable minWidthClass="min-w-[760px]">
          <AdminTableHeader>
            <tr>
              <AdminTableHeadCell>Name</AdminTableHeadCell>
              <AdminTableHeadCell>Email</AdminTableHeadCell>
              <AdminTableHeadCell>Phone</AdminTableHeadCell>
              <AdminTableHeadCell>Role</AdminTableHeadCell>
              <AdminTableHeadCell>Status</AdminTableHeadCell>
              <AdminTableHeadCell>Joined</AdminTableHeadCell>
            </tr>
          </AdminTableHeader>
          <AdminTableBody>
            {filteredStudents.map((student) => (
              <AdminTableRow key={student.id}>
                <AdminTableCell className="font-medium">{student.fullName}</AdminTableCell>
                <AdminTableCell>{student.email}</AdminTableCell>
                <AdminTableCell>{student.phone}</AdminTableCell>
                <AdminTableCell>{student.role}</AdminTableCell>
                <AdminTableCell>
                  <Badge variant={activeStateBadgeVariant(student.status === "ACTIVE")}>
                    {student.status}
                  </Badge>
                </AdminTableCell>
                <AdminTableCell>{formatDate(student.createdAt)}</AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      )}
    </section>
  )
}
