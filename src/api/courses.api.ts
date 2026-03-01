import { z } from "zod"

import { apiClient } from "@/api/client"
import { extractApiData, getHttpErrorMessage, mapApiItems } from "@/api/http"
import type { Course, CourseDifficulty } from "@/types/course"

const difficultySchema = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])

const courseRawSchema = z.object({
  id: z.string().or(z.number()).optional(),
  title: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  duration_months: z.number().optional(),
  durationMonths: z.number().optional(),
  price: z.number().or(z.string()).optional(),
  difficulty_level: difficultySchema.optional(),
  difficultyLevel: difficultySchema.optional(),
  skills_covered: z.array(z.string()).optional(),
  skillsCovered: z.array(z.string()).optional(),
  thumbnail: z.string().nullable().optional(),
  is_published: z.boolean().optional(),
  isPublished: z.boolean().optional(),
})

function mapCourse(rawValue: unknown): Course {
  const raw = courseRawSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    title: raw.title ?? "",
    slug: raw.slug ?? "",
    description: raw.description ?? "",
    durationMonths: raw.duration_months ?? raw.durationMonths ?? 0,
    price: Number(raw.price ?? 0),
    difficultyLevel:
      raw.difficulty_level ??
      raw.difficultyLevel ??
      ("BEGINNER" as CourseDifficulty),
    skillsCovered: raw.skills_covered ?? raw.skillsCovered ?? [],
    thumbnail: raw.thumbnail ?? null,
    isPublished: raw.is_published ?? raw.isPublished ?? false,
  }
}

export const coursesApi = {
  async getAll(): Promise<Course[]> {
    try {
      const response = await apiClient.get("/courses")
      return mapApiItems(response.data, mapCourse)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async getBySlug(slug: string): Promise<Course> {
    try {
      const response = await apiClient.get(`/courses/${slug}`)
      const payload = extractApiData(response.data)
      return mapCourse(payload)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
