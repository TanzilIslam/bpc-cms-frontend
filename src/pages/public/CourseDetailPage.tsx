import { Link, useParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCourse } from "@/hooks/useCourses"
import { formatMoney } from "@/lib/formatters"

export function CourseDetailPage() {
  const params = useParams()
  const slug = params.slug ?? ""
  const { course, isLoading, error, reload } = useCourse(slug)

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading course details...</p>
  }

  if (error) {
    return (
      <div className="space-y-3 rounded-lg border p-4">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={() => void reload()}>
          Retry
        </Button>
      </div>
    )
  }

  if (!course) {
    return <p className="text-sm text-muted-foreground">Course not found.</p>
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{course.difficultyLevel}</Badge>
          <Badge variant="outline">
            {course.durationMonths} month{course.durationMonths > 1 ? "s" : ""}
          </Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{course.title}</h1>
        <p className="text-muted-foreground">{course.description}</p>
      </div>

      <div className="grid gap-4 rounded-lg border p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Course Fee</p>
          <p className="text-2xl font-semibold text-primary">{formatMoney(course.price)}</p>
        </div>
        <Button asChild>
          <Link to={`/enroll?course=${encodeURIComponent(course.title)}`}>Enroll in This Course</Link>
        </Button>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Skills Covered</h2>
        {course.skillsCovered.length === 0 ? (
          <p className="text-sm text-muted-foreground">Skills list is not available yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {course.skillsCovered.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
