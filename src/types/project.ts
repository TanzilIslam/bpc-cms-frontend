export type Project = {
  id: string
  title: string
  description: string
  thumbnail: string | null
  technologiesUsed: string[]
  githubLink: string | null
  liveDemoLink: string | null
  studentName: string
  isFeatured: boolean
  isPublic: boolean
  likesCount: number
  viewsCount: number
  createdAt: string | null
}

export type StudentProjectPayload = {
  title: string
  description: string
  technologiesUsed: string[]
  githubLink?: string
  liveDemoLink?: string
  thumbnail?: string
  isPublic: boolean
}
