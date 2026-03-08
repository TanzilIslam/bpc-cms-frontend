export type CourseDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
export type ContentType = "VIDEO" | "PDF" | "TEXT" | "LINK"

export type Course = {
  id: string
  title: string
  slug: string
  description: string
  durationMonths: number
  price: number
  difficultyLevel: CourseDifficulty
  skillsCovered: string[]
  thumbnail: string | null
  isPublished: boolean
}

export type CourseContent = {
  id: string
  courseId: string
  moduleTitle: string
  contentTitle: string
  contentType: ContentType
  content: string | null
  orderIndex: number
  isPreview: boolean
}
