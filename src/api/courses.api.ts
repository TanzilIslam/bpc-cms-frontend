import { z } from "zod"

import { apiClient } from "@/api/client"
import { extractApiData, getHttpErrorMessage, mapApiItems } from "@/api/http"
import type { ContentType, Course, CourseDifficulty, CourseContent } from "@/types/course"

const difficultySchema = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
const contentTypeSchema = z.enum(["VIDEO", "PDF", "TEXT", "LINK"])

const courseContentSchema = z.object({
  id: z.string().or(z.number()).optional(),
  course_id: z.string().or(z.number()).optional(),
  courseId: z.string().or(z.number()).optional(),
  module_title: z.string().optional(),
  moduleTitle: z.string().optional(),
  content_title: z.string().optional(),
  contentTitle: z.string().optional(),
  content_type: contentTypeSchema.optional(),
  contentType: contentTypeSchema.optional(),
  content: z.string().nullable().optional(),
  order_index: z.number().optional(),
  orderIndex: z.number().optional(),
  is_preview: z.boolean().optional(),
  isPreview: z.boolean().optional(),
})

function mapCourseContent(rawValue: unknown): CourseContent {
  const raw = courseContentSchema.parse(rawValue)
  return {
    id: String(raw.id ?? ""),
    courseId: String(raw.course_id ?? raw.courseId ?? ""),
    moduleTitle: raw.module_title ?? raw.moduleTitle ?? "",
    contentTitle: raw.content_title ?? raw.contentTitle ?? "",
    contentType: (raw.content_type ?? raw.contentType ?? "TEXT") as ContentType,
    content: raw.content ?? null,
    orderIndex: raw.order_index ?? raw.orderIndex ?? 0,
    isPreview: raw.is_preview ?? raw.isPreview ?? false,
  }
}

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

  async getContent(courseId: string): Promise<CourseContent[]> {
    try {
      const response = await apiClient.get(`/courses/${courseId}/content`)
      return mapApiItems(response.data, mapCourseContent)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
