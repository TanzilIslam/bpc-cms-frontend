import { useCallback, useEffect, useState } from "react"

import { coursesApi } from "@/api/courses.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { Course } from "@/types/course"

type CoursesState = {
  courses: Course[]
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useCourses(): CoursesState {
  const loadCourses = useCallback(() => coursesApi.getAll(), [])
  const { data: courses, isLoading, error, reload } = useAsyncResource<Course[]>({
    initialData: [],
    load: loadCourses,
    fallbackError: "Failed to load courses.",
  })

  return { courses, isLoading, error, reload }
}

type CourseState = {
  course: Course | null
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useCourse(slug: string): CourseState {
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!slug) {
      setCourse(null)
      setError("Course slug is missing.")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await coursesApi.getBySlug(slug)
      setCourse(data)
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to load course details."
      setError(message)
      setCourse(null)
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    void reload()
  }, [reload])

  return { course, isLoading, error, reload }
}
