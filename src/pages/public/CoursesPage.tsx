import { useMemo, useState } from "react"

import { CourseCard } from "@/components/shared/CourseCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCourses } from "@/hooks/useCourses"
import type { CourseDifficulty } from "@/types/course"

export function CoursesPage() {
  const { courses, isLoading, error, reload } = useCourses()
  const [searchTerm, setSearchTerm] = useState("")
  const [difficulty, setDifficulty] = useState<"ALL" | CourseDifficulty>("ALL")

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesDifficulty =
        difficulty === "ALL" ? true : course.difficultyLevel === difficulty
      const matchesSearch =
        searchTerm.trim().length === 0
          ? true
          : course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesDifficulty && matchesSearch
    })
  }, [courses, difficulty, searchTerm])

  return (
    <section className="mx-auto grid max-w-6xl gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Courses</h1>
        <p className="text-muted-foreground">
          Explore available tracks and choose the course that matches your level.
        </p>
      </div>

      <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_220px]">
        <Input
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value as "ALL" | CourseDifficulty)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="ALL">All Levels</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading courses...</p>
      ) : error ? (
        <div className="space-y-2 rounded-lg border p-4">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => void reload()}>
            Retry
          </Button>
        </div>
      ) : filteredCourses.length === 0 ? (
        <p className="text-sm text-muted-foreground">No courses match your filter.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id || course.slug} course={course} />
          ))}
        </div>
      )}
    </section>
  )
}
