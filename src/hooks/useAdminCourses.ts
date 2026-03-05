import { useCallback } from "react"

import { adminApi } from "@/api/admin.api"
import { useAsyncMutation, useAsyncResource } from "@/hooks/useAsyncState"
import type {
  AdminCreateCoursePayload,
  AdminCreateCourseContentPayload,
  AdminUpdateCoursePayload,
} from "@/types/admin"
import type { Course } from "@/types/course"

type AdminCoursesState = {
  courses: Course[]
  isLoading: boolean
  isMutating: boolean
  error: string | null
  actionError: string | null
  reload: () => Promise<void>
  createCourse: (payload: AdminCreateCoursePayload) => Promise<void>
  updateCourse: (courseId: string, payload: AdminUpdateCoursePayload) => Promise<void>
  createCourseContent: (payload: AdminCreateCourseContentPayload) => Promise<void>
}

export function useAdminCourses(): AdminCoursesState {
  const loadCourses = useCallback(() => adminApi.getCourses(), [])
  const { data: courses, isLoading, error, reload } = useAsyncResource<Course[]>({
    initialData: [],
    load: loadCourses,
    fallbackError: "Failed to load courses.",
  })
  const { isMutating, actionError, runMutation } = useAsyncMutation()

  const createCourse = useCallback(
    async (payload: AdminCreateCoursePayload) => {
      await runMutation(async () => {
        await adminApi.createCourse(payload)
        await reload()
      }, "Failed to create course.")
    },
    [reload, runMutation]
  )

  const createCourseContent = useCallback(
    async (payload: AdminCreateCourseContentPayload) => {
      await runMutation(async () => {
        await adminApi.createCourseContent(payload)
      }, "Failed to create course content.")
    },
    [runMutation]
  )

  const updateCourse = useCallback(
    async (courseId: string, payload: AdminUpdateCoursePayload) => {
      await runMutation(async () => {
        await adminApi.updateCourse(courseId, payload)
        await reload()
      }, "Failed to update course.")
    },
    [reload, runMutation]
  )

  return {
    courses,
    isLoading,
    isMutating,
    error,
    actionError,
    reload,
    createCourse,
    updateCourse,
    createCourseContent,
  }
}
