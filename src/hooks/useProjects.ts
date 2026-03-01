import { useCallback } from "react"

import { projectsApi } from "@/api/projects.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { Project } from "@/types/project"

type ProjectsState = {
  projects: Project[]
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useProjects(): ProjectsState {
  const loadProjects = useCallback(() => projectsApi.getAll(), [])
  const { data: projects, isLoading, error, reload } = useAsyncResource<Project[]>({
    initialData: [],
    load: loadProjects,
    fallbackError: "Failed to load projects.",
  })

  return { projects, isLoading, error, reload }
}
