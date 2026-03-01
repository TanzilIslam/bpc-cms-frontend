import { z } from "zod"

import { extractApiItems, getHttpErrorMessage } from "@/api/http"
import { getWithFallback } from "@/api/request"
import type { PublicTestimonial } from "@/types/testimonial"

const testimonialSchema = z.object({
  id: z.string().or(z.number()).optional(),
  rating: z.number().optional(),
  review: z.string().optional(),
  is_featured: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  is_approved: z.boolean().optional(),
  isApproved: z.boolean().optional(),
  created_at: z.string().optional(),
  createdAt: z.string().optional(),
  student_name: z.string().optional(),
  studentName: z.string().optional(),
  course_title: z.string().optional(),
  courseTitle: z.string().optional(),
  student: z
    .object({
      full_name: z.string().optional(),
      fullName: z.string().optional(),
    })
    .optional(),
  course: z
    .object({
      title: z.string().optional(),
    })
    .optional(),
})

function mapTestimonial(rawValue: unknown): PublicTestimonial {
  const raw = testimonialSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    studentName:
      raw.student_name ??
      raw.studentName ??
      raw.student?.full_name ??
      raw.student?.fullName ??
      "Unknown Student",
    courseTitle: raw.course_title ?? raw.courseTitle ?? raw.course?.title ?? "Unknown Course",
    rating: raw.rating ?? 0,
    review: raw.review ?? "",
    isFeatured: raw.is_featured ?? raw.isFeatured ?? false,
    createdAt: raw.created_at ?? raw.createdAt ?? null,
  }
}

async function fetchFrom(paths: readonly string[]): Promise<PublicTestimonial[]> {
  const payload = await getWithFallback(paths)
  const source = extractApiItems(payload)

  return source
    .map((item) => {
      const raw = testimonialSchema.parse(item)
      const mapped = mapTestimonial(raw)
      const isApproved = raw.is_approved ?? raw.isApproved

      return {
        mapped,
        isApproved,
      }
    })
    .filter((item) => item.mapped.id.length > 0 && item.isApproved !== false)
    .map((item) => item.mapped)
}

export const testimonialsApi = {
  async getApproved(): Promise<PublicTestimonial[]> {
    try {
      return await fetchFrom(["/testimonials", "/testimonials/approved"])
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
