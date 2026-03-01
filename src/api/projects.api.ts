import { z } from "zod"

import { getHttpErrorMessage, mapApiItems } from "@/api/http"
import {
  deleteWithFallback,
  getWithFallback,
  postWithFallback,
  putWithFallback,
} from "@/api/request"
import type { Project, StudentProjectPayload } from "@/types/project"

const projectRawSchema = z.object({
  id: z.string().or(z.number()).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().nullable().optional(),
  technologies_used: z.array(z.string()).optional(),
  technologiesUsed: z.array(z.string()).optional(),
  github_link: z.string().nullable().optional(),
  githubLink: z.string().nullable().optional(),
  live_demo_link: z.string().nullable().optional(),
  liveDemoLink: z.string().nullable().optional(),
  is_featured: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  is_public: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  likes_count: z.number().or(z.string()).optional(),
  likesCount: z.number().or(z.string()).optional(),
  views_count: z.number().or(z.string()).optional(),
  viewsCount: z.number().or(z.string()).optional(),
  student_name: z.string().optional(),
  studentName: z.string().optional(),
  student: z
    .object({
      full_name: z.string().optional(),
      fullName: z.string().optional(),
    })
    .optional(),
  created_at: z.string().optional(),
  createdAt: z.string().optional(),
})

function mapProject(rawValue: unknown): Project {
  const raw = projectRawSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    title: raw.title ?? "Untitled Project",
    description: raw.description ?? "",
    thumbnail: raw.thumbnail ?? null,
    technologiesUsed: raw.technologies_used ?? raw.technologiesUsed ?? [],
    githubLink: raw.github_link ?? raw.githubLink ?? null,
    liveDemoLink: raw.live_demo_link ?? raw.liveDemoLink ?? null,
    studentName:
      raw.student_name ?? raw.studentName ?? raw.student?.full_name ?? raw.student?.fullName ?? "-",
    isFeatured: raw.is_featured ?? raw.isFeatured ?? false,
    isPublic: raw.is_public ?? raw.isPublic ?? true,
    likesCount: Number(raw.likes_count ?? raw.likesCount ?? 0),
    viewsCount: Number(raw.views_count ?? raw.viewsCount ?? 0),
    createdAt: raw.created_at ?? raw.createdAt ?? null,
  }
}

type ProjectApiPayload = {
  title: string
  description: string
  technologies_used: string[]
  github_link?: string
  live_demo_link?: string
  thumbnail?: string
  is_public: boolean
}

function toApiPayload(payload: StudentProjectPayload): ProjectApiPayload {
  return {
    title: payload.title,
    description: payload.description,
    technologies_used: payload.technologiesUsed,
    github_link: payload.githubLink,
    live_demo_link: payload.liveDemoLink,
    thumbnail: payload.thumbnail,
    is_public: payload.isPublic,
  }
}

export const projectsApi = {
  async getAll(): Promise<Project[]> {
    try {
      const payload = await getWithFallback(["/projects"])
      return mapApiItems(payload, mapProject).filter((project) => project.isPublic)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async getMine(): Promise<Project[]> {
    try {
      const payload = await getWithFallback(["/students/me/projects", "/projects/me"])
      return mapApiItems(payload, mapProject)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async createMine(payload: StudentProjectPayload): Promise<Project> {
    try {
      const responsePayload = await postWithFallback(
        ["/students/me/projects", "/projects"],
        toApiPayload(payload)
      )
      return mapProject(responsePayload)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async updateMine(projectId: string, payload: StudentProjectPayload): Promise<Project> {
    try {
      const responsePayload = await putWithFallback(
        [`/students/me/projects/${projectId}`, `/projects/${projectId}`],
        toApiPayload(payload)
      )
      return mapProject(responsePayload)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async deleteMine(projectId: string): Promise<void> {
    try {
      await deleteWithFallback([`/students/me/projects/${projectId}`, `/projects/${projectId}`])
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
