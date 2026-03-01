import { useMemo, useState } from "react"

import {
  EmptyStatePanel,
  InlineErrorMessage,
  PageErrorState,
  PageLoadingState,
} from "@/components/shared/AsyncStates"
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
import { useAdminTestimonials } from "@/hooks/useAdminTestimonials"
import { approvedBadgeVariant, featuredBadgeVariant } from "@/lib/admin-badges"
import { formatDate } from "@/lib/formatters"

function ratingLabel(rating: number): string {
  if (rating <= 0) {
    return "-"
  }

  return `${rating}/5`
}

export function AdminTestimonialsPage() {
  const {
    testimonials,
    isLoading,
    isMutating,
    error,
    actionError,
    reload,
    setApproved,
    setFeatured,
  } = useAdminTestimonials()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTestimonials = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()

    return testimonials.filter((testimonial) => {
      if (normalized.length === 0) {
        return true
      }

      return (
        testimonial.studentName.toLowerCase().includes(normalized) ||
        testimonial.courseTitle.toLowerCase().includes(normalized) ||
        testimonial.review.toLowerCase().includes(normalized)
      )
    })
  }, [searchTerm, testimonials])

  async function handleApproveToggle(testimonialId: string, isApproved: boolean) {
    try {
      await setApproved(testimonialId, !isApproved)
    } catch {
      // Error shown via hook actionError state.
    }
  }

  async function handleFeatureToggle(testimonialId: string, isFeatured: boolean) {
    try {
      await setFeatured(testimonialId, !isFeatured)
    } catch {
      // Error shown via hook actionError state.
    }
  }

  if (isLoading) {
    return <PageLoadingState message="Loading testimonials..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  return (
    <section className="space-y-5">
      <AdminPageHeader
        title="Testimonials"
        actions={
          <Input
            className="max-w-xs"
            placeholder="Search student/course/review"
            aria-label="Search testimonials"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        }
      />

      <InlineErrorMessage message={actionError} />

      {filteredTestimonials.length === 0 ? (
        <EmptyStatePanel
          title="No testimonials found"
          description={
            searchTerm.trim().length > 0
              ? "No testimonial matched your search query."
              : "Student testimonials will appear here after submissions."
          }
          action={
            searchTerm.trim().length > 0 ? (
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            ) : undefined
          }
        />
      ) : (
        <AdminTable minWidthClass="min-w-[980px]">
          <AdminTableHeader>
            <tr>
              <AdminTableHeadCell>Student</AdminTableHeadCell>
              <AdminTableHeadCell>Course</AdminTableHeadCell>
              <AdminTableHeadCell>Rating</AdminTableHeadCell>
              <AdminTableHeadCell>Review</AdminTableHeadCell>
              <AdminTableHeadCell>Created</AdminTableHeadCell>
              <AdminTableHeadCell>Status</AdminTableHeadCell>
              <AdminTableHeadCell>Actions</AdminTableHeadCell>
            </tr>
          </AdminTableHeader>
          <AdminTableBody>
            {filteredTestimonials.map((testimonial) => (
              <AdminTableRow key={testimonial.id} className="align-top">
                <AdminTableCell className="font-medium">{testimonial.studentName}</AdminTableCell>
                <AdminTableCell>{testimonial.courseTitle}</AdminTableCell>
                <AdminTableCell>{ratingLabel(testimonial.rating)}</AdminTableCell>
                <AdminTableCell>
                  <p className="line-clamp-3 max-w-md text-xs text-muted-foreground">
                    {testimonial.review}
                  </p>
                </AdminTableCell>
                <AdminTableCell>{formatDate(testimonial.createdAt)}</AdminTableCell>
                <AdminTableCell>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={approvedBadgeVariant(testimonial.isApproved)}>
                      {testimonial.isApproved ? "APPROVED" : "PENDING"}
                    </Badge>
                    <Badge variant={featuredBadgeVariant(testimonial.isFeatured)}>
                      {testimonial.isFeatured ? "FEATURED" : "NORMAL"}
                    </Badge>
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        void handleApproveToggle(testimonial.id, testimonial.isApproved)
                      }
                      disabled={isMutating}
                    >
                      {testimonial.isApproved ? "Unapprove" : "Approve"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        void handleFeatureToggle(testimonial.id, testimonial.isFeatured)
                      }
                      disabled={isMutating || !testimonial.isApproved}
                    >
                      {testimonial.isFeatured ? "Unfeature" : "Feature"}
                    </Button>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      )}
    </section>
  )
}
