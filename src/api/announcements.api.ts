import { z } from "zod"

import { extractApiItems, getHttpErrorMessage } from "@/api/http"
import { getWithFallback } from "@/api/request"
import type {
  AnnouncementAudience,
  AnnouncementPriority,
  PublicAnnouncement,
} from "@/types/announcement"

const audienceSchema = z.enum(["ALL", "BATCH_SPECIFIC", "COURSE_SPECIFIC"])
const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"])

const announcementSchema = z.object({
  id: z.string().or(z.number()).optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  target_audience: audienceSchema.optional(),
  targetAudience: audienceSchema.optional(),
  priority: prioritySchema.optional(),
  publish_date: z.string().nullable().optional(),
  publishDate: z.string().nullable().optional(),
  is_published: z.boolean().optional(),
  isPublished: z.boolean().optional(),
})

function mapAnnouncement(rawValue: unknown): PublicAnnouncement {
  const raw = announcementSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    title: raw.title ?? "Untitled Announcement",
    content: raw.content ?? "",
    targetAudience: (raw.target_audience ??
      raw.targetAudience ??
      "ALL") as AnnouncementAudience,
    priority: (raw.priority ?? "MEDIUM") as AnnouncementPriority,
    publishDate: raw.publish_date ?? raw.publishDate ?? null,
  }
}

async function fetchFrom(paths: readonly string[]): Promise<PublicAnnouncement[]> {
  const payload = await getWithFallback(paths)
  const source = extractApiItems(payload)

  return source
    .map((item) => {
      const raw = announcementSchema.parse(item)
      const mapped = mapAnnouncement(raw)
      const isPublished = raw.is_published ?? raw.isPublished

      return {
        mapped,
        isPublished,
      }
    })
    .filter((item) => item.mapped.id.length > 0 && item.isPublished !== false)
    .map((item) => item.mapped)
}

export const announcementsApi = {
  async getPublished(): Promise<PublicAnnouncement[]> {
    try {
      return await fetchFrom(["/announcements", "/announcements/published"])
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
