import { useCallback } from "react"

import { projectsApi } from "@/api/projects.api"
import { useAsyncMutation, useAsyncResource } from "@/hooks/useAsyncState"
import type { Project, StudentProjectPayload } from "@/types/project"

type StudentProjectsState = {
  projects: Project[]
  isLoading: boolean
  isMutating: boolean
  error: string | null
  actionError: string | null
  reload: () => Promise<void>
  createProject: (payload: StudentProjectPayload) => Promise<void>
  updateProject: (projectId: string, payload: StudentProjectPayload) => Promise<void>
  deleteProject: (projectId: string) => Promise<void>
}

export function useStudentProjects(): StudentProjectsState {
  const loadProjects = useCallback(() => projectsApi.getMine(), [])
  const { data: projects, setData: setProjects, isLoading, error, reload } =
    useAsyncResource<Project[]>({
      initialData: [],
      load: loadProjects,
      fallbackError: "Failed to load projects.",
    })
  const { isMutating, actionError, runMutation } = useAsyncMutation()

  const createProject = useCallback(
    async (payload: StudentProjectPayload) => {
      await runMutation(async () => {
        const created = await projectsApi.createMine(payload)
        setProjects((prev) => [created, ...prev])
      }, "Failed to create project.")
    },
    [runMutation, setProjects]
  )

  const updateProject = useCallback(
    async (projectId: string, payload: StudentProjectPayload) => {
      await runMutation(async () => {
        const updated = await projectsApi.updateMine(projectId, payload)
        setProjects((prev) =>
          prev.map((project) => (project.id === projectId ? updated : project))
        )
      }, "Failed to update project.")
    },
    [runMutation, setProjects]
  )

  const deleteProject = useCallback(async (projectId: string) => {
    await runMutation(async () => {
      await projectsApi.deleteMine(projectId)
      setProjects((prev) => prev.filter((project) => project.id !== projectId))
    }, "Failed to delete project.")
  }, [runMutation, setProjects])

  return {
    projects,
    isLoading,
    isMutating,
    error,
    actionError,
    reload,
    createProject,
    updateProject,
    deleteProject,
  }
}
