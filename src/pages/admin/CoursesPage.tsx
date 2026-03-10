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
  slug: string
  description: string
  durationMonths: string
  price: string
  difficultyLevel: CourseDifficulty
  skillsCsv: string
  isPublished: boolean
}

const emptyForm: CourseFormState = {
  title: "",
  slug: "",
  description: "",
  durationMonths: "2",
  price: "10000",
  difficultyLevel: "BEGINNER",
  skillsCsv: "HTML, CSS, JavaScript",
  isPublished: false,
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

type CourseContentFormState = {
  courseId: string
  moduleTitle: string
  contentTitle: string
  contentType: "VIDEO" | "PDF" | "TEXT" | "LINK"
  content: string
  orderIndex: string
  isPreview: boolean
}

const emptyContentForm: CourseContentFormState = {
  courseId: "",
  moduleTitle: "",
  contentTitle: "",
  contentType: "TEXT",
  content: "",
  orderIndex: "1",
  isPreview: false,
}

function formFromCourse(course: Course): CourseFormState {
  return {
    title: course.title,
    slug: course.slug,
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
    createCourseContent,
  } = useAdminCourses()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [form, setForm] = useState<CourseFormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const [contentDialogOpen, setContentDialogOpen] = useState(false)
  const [contentForm, setContentForm] = useState<CourseContentFormState>(emptyContentForm)
  const [contentFormError, setContentFormError] = useState<string | null>(null)

  function openCreateDialog() {
    setEditingCourseId(null)
    setForm(emptyForm)
    setFormError(null)
    setDialogOpen(true)
  }

  function openCreateContentDialog() {
    setContentForm({
      ...emptyContentForm,
      courseId: courses[0]?.id ?? "",
    })
    setContentFormError(null)
    setContentDialogOpen(true)
  }

  function openEditDialog(course: Course) {
    setEditingCourseId(course.id)
    setForm(formFromCourse(course))
    setFormError(null)
    setDialogOpen(true)
  }

  function updateForm<K extends keyof CourseFormState>(key: K, value: CourseFormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === "title" && !editingCourseId) {
        next.slug = toSlug(value as string)
      }
      return next
    })
  }

  function updateContentForm<K extends keyof CourseContentFormState>(
    key: K,
    value: CourseContentFormState[K]
  ) {
    setContentForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmitCourseContent() {
    setContentFormError(null)

    if (!contentForm.courseId) {
      setContentFormError("Select a course.")
      return
    }

    if (contentForm.moduleTitle.trim().length < 2 || contentForm.contentTitle.trim().length < 2) {
      setContentFormError("Module and content title are required.")
      return
    }

    if (contentForm.content.trim().length === 0) {
      setContentFormError("Content body/link is required.")
      return
    }

    const orderIndex = Number(contentForm.orderIndex)
    if (Number.isNaN(orderIndex) || orderIndex < 1) {
      setContentFormError("Order must be 1 or greater.")
      return
    }

    try {
      await createCourseContent({
        courseId: contentForm.courseId,
        moduleTitle: contentForm.moduleTitle.trim(),
        contentTitle: contentForm.contentTitle.trim(),
        contentType: contentForm.contentType,
        content: contentForm.content.trim(),
        orderIndex,
        isPreview: contentForm.isPreview,
      })
      setContentDialogOpen(false)
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Failed to create course content."
      setContentFormError(message)
    }
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
          slug: form.slug.trim(),
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
          slug: form.slug.trim(),
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
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={openCreateContentDialog} disabled={courses.length === 0}>
              Add Content
            </Button>
            <Button onClick={openCreateDialog}>Create Course</Button>
          </div>
        }
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

      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Course Content</DialogTitle>
            <DialogDescription>
              Create a module/content item for an existing course.
            </DialogDescription>
          </DialogHeader>

          <AdminFormGrid>
            <AdminFormField id="content-course" label="Course">
              <select
                id="content-course"
                value={contentForm.courseId}
                onChange={(event) => updateContentForm("courseId", event.target.value)}
                className={NATIVE_SELECT_CLASS_NAME}
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </AdminFormField>

            <div className="grid gap-3 md:grid-cols-2">
              <AdminFormField id="content-module-title" label="Module Title">
                <Input
                  id="content-module-title"
                  value={contentForm.moduleTitle}
                  onChange={(event) => updateContentForm("moduleTitle", event.target.value)}
                />
              </AdminFormField>
              <AdminFormField id="content-title" label="Content Title">
                <Input
                  id="content-title"
                  value={contentForm.contentTitle}
                  onChange={(event) => updateContentForm("contentTitle", event.target.value)}
                />
              </AdminFormField>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <AdminFormField id="content-type" label="Content Type">
                <select
                  id="content-type"
                  value={contentForm.contentType}
                  onChange={(event) =>
                    updateContentForm(
                      "contentType",
                      event.target.value as "VIDEO" | "PDF" | "TEXT" | "LINK"
                    )
                  }
                  className={NATIVE_SELECT_CLASS_NAME}
                >
                  <option value="TEXT">Text</option>
                  <option value="VIDEO">Video</option>
                  <option value="PDF">PDF</option>
                  <option value="LINK">Link</option>
                </select>
              </AdminFormField>
              <AdminFormField id="content-order" label="Order">
                <Input
                  id="content-order"
                  type="number"
                  min={1}
                  value={contentForm.orderIndex}
                  onChange={(event) => updateContentForm("orderIndex", event.target.value)}
                />
              </AdminFormField>
            </div>

            <AdminFormField id="content-body" label="Content / URL">
              <Textarea
                id="content-body"
                rows={4}
                value={contentForm.content}
                onChange={(event) => updateContentForm("content", event.target.value)}
              />
            </AdminFormField>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={contentForm.isPreview}
                onChange={(event) => updateContentForm("isPreview", event.target.checked)}
              />
              Allow preview access
            </label>

            <AdminFormError message={contentFormError} />
          </AdminFormGrid>

          <DialogFooter showCloseButton>
            <Button onClick={() => void handleSubmitCourseContent()} disabled={isMutating}>
              {isMutating ? "Saving..." : "Create Content"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

            <AdminFormField id="course-slug" label="Slug">
              <Input
                id="course-slug"
                value={form.slug}
                onChange={(event) => updateForm("slug", event.target.value)}
                placeholder="auto-generated-from-title"
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
