import { useState } from "react"

import {
  EmptyStatePanel,
  InlineErrorMessage,
  PageErrorState,
  PageLoadingState,
} from "@/components/shared/AsyncStates"
import { AdminFormError, AdminFormField, AdminFormGrid } from "@/components/shared/AdminForm"
import { AdminListCard } from "@/components/shared/AdminListCard"
import { AdminPageHeader } from "@/components/shared/AdminPageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAdminCourses } from "@/hooks/useAdminCourses"
import {
  COURSE_DIFFICULTY_OPTIONS,
  NATIVE_SELECT_CLASS_NAME,
} from "@/lib/admin-options"
import { publishedBadgeVariant } from "@/lib/admin-badges"
import { formatMoney } from "@/lib/formatters"
import type { Course, CourseDifficulty } from "@/types/course"

type CourseFormState = {
  title: string
  description: string
  durationMonths: string
  price: string
  difficultyLevel: CourseDifficulty
  skillsCsv: string
  isPublished: boolean
}

const emptyForm: CourseFormState = {
  title: "",
  description: "",
  durationMonths: "2",
  price: "10000",
  difficultyLevel: "BEGINNER",
  skillsCsv: "HTML, CSS, JavaScript",
  isPublished: false,
}

function formFromCourse(course: Course): CourseFormState {
  return {
    title: course.title,
    description: course.description,
    durationMonths: String(course.durationMonths || 2),
    price: String(course.price || 0),
    difficultyLevel: course.difficultyLevel,
    skillsCsv: course.skillsCovered.join(", "),
    isPublished: course.isPublished,
  }
}

export function AdminCoursesPage() {
  const {
    courses,
    isLoading,
    isMutating,
    error,
    actionError,
    reload,
    createCourse,
    updateCourse,
  } = useAdminCourses()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [form, setForm] = useState<CourseFormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  function openCreateDialog() {
    setEditingCourseId(null)
    setForm(emptyForm)
    setFormError(null)
    setDialogOpen(true)
  }

  function openEditDialog(course: Course) {
    setEditingCourseId(course.id)
    setForm(formFromCourse(course))
    setFormError(null)
    setDialogOpen(true)
  }

  function updateForm<K extends keyof CourseFormState>(key: K, value: CourseFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmitCourse() {
    setFormError(null)

    const durationMonths = Number(form.durationMonths)
    const price = Number(form.price)
    const skillsCovered = form.skillsCsv
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)

    if (form.title.trim().length < 5) {
      setFormError("Title must be at least 5 characters.")
      return
    }

    if (form.description.trim().length < 20) {
      setFormError("Description must be at least 20 characters.")
      return
    }

    if (Number.isNaN(durationMonths) || durationMonths < 1 || durationMonths > 12) {
      setFormError("Duration must be between 1 and 12 months.")
      return
    }

    if (Number.isNaN(price) || price < 0) {
      setFormError("Price must be 0 or higher.")
      return
    }

    if (skillsCovered.length === 0) {
      setFormError("Add at least one skill.")
      return
    }

    try {
      if (editingCourseId) {
        await updateCourse(editingCourseId, {
          title: form.title.trim(),
          description: form.description.trim(),
          durationMonths,
          price,
          difficultyLevel: form.difficultyLevel,
          skillsCovered,
          isPublished: form.isPublished,
        })
      } else {
        await createCourse({
          title: form.title.trim(),
          description: form.description.trim(),
          durationMonths,
          price,
          difficultyLevel: form.difficultyLevel,
          skillsCovered,
          isPublished: form.isPublished,
        })
      }

      setDialogOpen(false)
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Failed to save course."
      setFormError(message)
    }
  }

  if (isLoading) {
    return <PageLoadingState message="Loading courses..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  return (
    <section className="space-y-4">
      <AdminPageHeader
        title="Courses"
        actions={<Button onClick={openCreateDialog}>Create Course</Button>}
      />
      <InlineErrorMessage message={actionError} />
      {courses.length === 0 ? (
        <EmptyStatePanel
          title="No course records found"
          description="Create your first course to start managing batch enrollments."
          action={
            <Button size="sm" onClick={openCreateDialog}>
              Create Course
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3">
          {courses.map((course) => (
            <AdminListCard
              key={course.id}
              title={course.title}
              subtitle={course.slug}
              headerRight={
                <>
                  <Badge variant="outline">{course.difficultyLevel}</Badge>
                  <Badge variant={publishedBadgeVariant(course.isPublished)}>
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </>
              }
              body={<p className="text-sm text-muted-foreground">{course.description}</p>}
              meta={
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span>{course.durationMonths} months</span>
                  <span>{formatMoney(course.price)}</span>
                  <span>{course.skillsCovered.length} skills</span>
                </div>
              }
              actions={
                <Button variant="outline" size="sm" onClick={() => openEditDialog(course)}>
                  Edit
                </Button>
              }
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCourseId ? "Edit Course" : "Create Course"}</DialogTitle>
            <DialogDescription>
              {editingCourseId
                ? "Update course details and publish status."
                : "Add a new course to your catalog."}
            </DialogDescription>
          </DialogHeader>

          <AdminFormGrid>
            <AdminFormField id="course-title" label="Title">
              <Input
                id="course-title"
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
              />
            </AdminFormField>

            <AdminFormField id="course-description" label="Description">
              <Textarea
                id="course-description"
                rows={4}
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
              />
            </AdminFormField>

            <div className="grid gap-3 md:grid-cols-3">
              <AdminFormField id="course-duration" label="Duration (months)">
                <Input
                  id="course-duration"
                  type="number"
                  min={1}
                  max={12}
                  value={form.durationMonths}
                  onChange={(event) => updateForm("durationMonths", event.target.value)}
                />
              </AdminFormField>
              <AdminFormField id="course-price" label="Price (BDT)">
                <Input
                  id="course-price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(event) => updateForm("price", event.target.value)}
                />
              </AdminFormField>
              <AdminFormField id="course-difficulty" label="Difficulty">
                <select
                  id="course-difficulty"
                  aria-label="Course difficulty level"
                  value={form.difficultyLevel}
                  onChange={(event) =>
                    updateForm("difficultyLevel", event.target.value as CourseDifficulty)
                  }
                  className={NATIVE_SELECT_CLASS_NAME}
                >
                  {COURSE_DIFFICULTY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </AdminFormField>
            </div>

            <AdminFormField id="course-skills" label="Skills (comma-separated)">
              <Input
                id="course-skills"
                value={form.skillsCsv}
                onChange={(event) => updateForm("skillsCsv", event.target.value)}
              />
            </AdminFormField>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                aria-label="Publish course immediately"
                checked={form.isPublished}
                onChange={(event) => updateForm("isPublished", event.target.checked)}
              />
              Publish immediately
            </label>

            <AdminFormError message={formError} />
          </AdminFormGrid>

          <DialogFooter showCloseButton>
            <Button onClick={() => void handleSubmitCourse()} disabled={isMutating}>
              {isMutating ? "Saving..." : editingCourseId ? "Update Course" : "Create Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
