import { useCallback } from "react"

import { useAsyncResource } from "@/hooks/useAsyncState"
import { testimonialsApi } from "@/api/testimonials.api"
import type { PublicTestimonial } from "@/types/testimonial"

type TestimonialsState = {
  testimonials: PublicTestimonial[]
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useTestimonials(): TestimonialsState {
  const loadTestimonials = useCallback(() => testimonialsApi.getApproved(), [])
  const { data: testimonials, isLoading, error, reload } = useAsyncResource<
    PublicTestimonial[]
  >({
    initialData: [],
    load: loadTestimonials,
    fallbackError: "Failed to load testimonials.",
  })

  return {
    testimonials,
    isLoading,
    error,
    reload,
  }
}
