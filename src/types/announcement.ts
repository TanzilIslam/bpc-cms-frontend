export type AnnouncementPriority = "LOW" | "MEDIUM" | "HIGH"
export type AnnouncementAudience = "ALL" | "BATCH_SPECIFIC" | "COURSE_SPECIFIC"

export type PublicAnnouncement = {
  id: string
  title: string
  content: string
  targetAudience: AnnouncementAudience
  priority: AnnouncementPriority
  publishDate: string | null
}
