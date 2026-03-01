import { useCallback, useMemo } from "react"

import { adminApi } from "@/api/admin.api"
import { useAsyncMutation, useAsyncResource } from "@/hooks/useAsyncState"
import type { AdminTestimonial } from "@/types/admin"

type AdminTestimonialsState = {
  testimonials: AdminTestimonial[]
  isLoading: boolean
  isMutating: boolean
  error: string | null
  actionError: string | null
  reload: () => Promise<void>
  setApproved: (testimonialId: string, isApproved: boolean) => Promise<void>
  setFeatured: (testimonialId: string, isFeatured: boolean) => Promise<void>
}

export function useAdminTestimonials(): AdminTestimonialsState {
  const loadTestimonials = useCallback(() => adminApi.getTestimonials(), [])
  const { data: testimonials, setData: setTestimonials, isLoading, error, reload } =
    useAsyncResource<AdminTestimonial[]>({
      initialData: [],
      load: loadTestimonials,
      fallbackError: "Failed to load testimonials.",
    })
  const { isMutating, actionError, runMutation } = useAsyncMutation()

  const updateRow = useCallback((testimonialId: string, updated: AdminTestimonial) => {
    setTestimonials((prev) =>
      prev.map((testimonial) => (testimonial.id === testimonialId ? updated : testimonial))
    )
  }, [setTestimonials])

  const setApproved = useCallback(
    async (testimonialId: string, isApproved: boolean) => {
      await runMutation(async () => {
        const updated = await adminApi.setTestimonialApproved(testimonialId, isApproved)
        updateRow(testimonialId, updated)
      }, "Failed to update testimonial approval.")
    },
    [runMutation, updateRow]
  )

  const setFeatured = useCallback(
    async (testimonialId: string, isFeatured: boolean) => {
      await runMutation(async () => {
        const updated = await adminApi.setTestimonialFeatured(testimonialId, isFeatured)
        updateRow(testimonialId, updated)
      }, "Failed to update testimonial feature state.")
    },
    [runMutation, updateRow]
  )

  const sortedTestimonials = useMemo(
    () =>
      [...testimonials].sort((left, right) => {
        if (left.isApproved !== right.isApproved) {
          return Number(right.isApproved) - Number(left.isApproved)
        }
        if (left.isFeatured !== right.isFeatured) {
          return Number(right.isFeatured) - Number(left.isFeatured)
        }

        return right.rating - left.rating
      }),
    [testimonials]
  )

  return {
    testimonials: sortedTestimonials,
    isLoading,
    isMutating,
    error,
    actionError,
    reload,
    setApproved,
    setFeatured,
  }
}
