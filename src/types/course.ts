export type CourseDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"

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
