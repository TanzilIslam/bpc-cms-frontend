import { useMemo, useState } from "react"

import {
  InlineErrorMessage,
  PageErrorState,
  PageLoadingState,
} from "@/components/shared/AsyncStates"
import { AdminActionButtons } from "@/components/shared/AdminActionButtons"
import { AdminFormError, AdminFormField, AdminFormGrid } from "@/components/shared/AdminForm"
import { AdminListCard } from "@/components/shared/AdminListCard"
import { PageHeader } from "@/components/shared/PageHeader"
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
import { useStudentProjects } from "@/hooks/useStudentProjects"
import { formatDate } from "@/lib/formatters"
import type { Project, StudentProjectPayload } from "@/types/project"

type ProjectFormState = {
  title: string
  description: string
  technologies: string
  githubLink: string
  liveDemoLink: string
  thumbnail: string
  isPublic: boolean
}

const emptyForm: ProjectFormState = {
  title: "",
  description: "",
  technologies: "",
  githubLink: "",
  liveDemoLink: "",
  thumbnail: "",
  isPublic: true,
}

function toPayload(form: ProjectFormState): StudentProjectPayload {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    technologiesUsed: form.technologies
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0),
    githubLink: form.githubLink.trim() || undefined,
    liveDemoLink: form.liveDemoLink.trim() || undefined,
    thumbnail: form.thumbnail.trim() || undefined,
    isPublic: form.isPublic,
  }
}

function toForm(project: Project): ProjectFormState {
  return {
    title: project.title,
    description: project.description,
    technologies: project.technologiesUsed.join(", "),
    githubLink: project.githubLink ?? "",
    liveDemoLink: project.liveDemoLink ?? "",
    thumbnail: project.thumbnail ?? "",
    isPublic: project.isPublic,
  }
}

export function MyProjectsPage() {
  const {
    projects,
    isLoading,
    isMutating,
    error,
    actionError,
    reload,
    createProject,
    updateProject,
    deleteProject,
  } = useStudentProjects()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [form, setForm] = useState<ProjectFormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const sortedProjects = useMemo(
    () =>
      [...projects].sort((left, right) => {
        const leftDate = left.createdAt ? new Date(left.createdAt).getTime() : 0
        const rightDate = right.createdAt ? new Date(right.createdAt).getTime() : 0
        return rightDate - leftDate
      }),
    [projects]
  )

  function updateForm<K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function openCreateDialog() {
    setEditingProjectId(null)
    setForm(emptyForm)
    setFormError(null)
    setDialogOpen(true)
  }

  function openEditDialog(project: Project) {
    setEditingProjectId(project.id)
    setForm(toForm(project))
    setFormError(null)
    setDialogOpen(true)
  }

  async function handleSaveProject() {
    setFormError(null)
    const payload = toPayload(form)

    if (!payload.title) {
      setFormError("Project title is required.")
      return
    }

    if (!payload.description) {
      setFormError("Project description is required.")
      return
    }

    if (payload.technologiesUsed.length === 0) {
      setFormError("Add at least one technology.")
      return
    }

    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, payload)
      } else {
        await createProject(payload)
      }
      setDialogOpen(false)
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to save project."
      setFormError(message)
    }
  }

  async function handleDeleteProject(projectId: string) {
    const shouldDelete = window.confirm("Delete this project?")
    if (!shouldDelete) {
      return
    }

    try {
      await deleteProject(projectId)
    } catch {
      // Error is exposed through actionError in hook state.
    }
  }

  if (isLoading) {
    return <PageLoadingState message="Loading your projects..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  return (
    <section className="space-y-5">
      <PageHeader
        title="My Projects"
        description="Manage your public portfolio projects for showcase."
        actions={<Button onClick={openCreateDialog}>Add Project</Button>}
      />

      <InlineErrorMessage message={actionError} />

      {sortedProjects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You have not uploaded any projects yet.
        </p>
      ) : (
        <div className="grid gap-3">
          {sortedProjects.map((project) => (
            <AdminListCard
              key={project.id}
              title={project.title}
              subtitle={`Updated: ${formatDate(project.createdAt)}`}
              headerRight={
                <>
                  <Badge variant={project.isPublic ? "default" : "outline"}>
                    {project.isPublic ? "Public" : "Private"}
                  </Badge>
                  {project.isFeatured ? <Badge variant="secondary">Featured</Badge> : null}
                </>
              }
              body={<p className="text-sm text-muted-foreground">{project.description}</p>}
              meta={
                <div className="flex flex-wrap gap-2">
                  {project.technologiesUsed.map((item) => (
                    <Badge key={`${project.id}-${item}`} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              }
              actions={
                <div className="flex flex-wrap items-center gap-2">
                  <AdminActionButtons
                    items={[
                      {
                        key: "edit",
                        label: "Edit",
                        variant: "outline",
                        size: "sm",
                        onClick: () => openEditDialog(project),
                      },
                      {
                        key: "delete",
                        label: "Delete",
                        variant: "outline",
                        size: "sm",
                        disabled: isMutating,
                        onClick: () => void handleDeleteProject(project.id),
                      },
                    ]}
                  />
                  {project.githubLink ? (
                    <Button asChild variant="ghost" size="sm">
                      <a href={project.githubLink} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    </Button>
                  ) : null}
                  {project.liveDemoLink ? (
                    <Button asChild variant="ghost" size="sm">
                      <a href={project.liveDemoLink} target="_blank" rel="noreferrer">
                        Live Demo
                      </a>
                    </Button>
                  ) : null}
                </div>
              }
            />
          ))}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setEditingProjectId(null)
            setForm(emptyForm)
            setFormError(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProjectId ? "Edit Project" : "Create Project"}</DialogTitle>
            <DialogDescription>
              Add your project details for the student showcase.
            </DialogDescription>
          </DialogHeader>

          <AdminFormGrid>
            <AdminFormField id="project-title" label="Title">
              <Input
                id="project-title"
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
              />
            </AdminFormField>

            <AdminFormField id="project-description" label="Description">
              <Textarea
                id="project-description"
                rows={4}
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
              />
            </AdminFormField>

            <AdminFormField id="project-technologies" label="Technologies (comma separated)">
              <Input
                id="project-technologies"
                value={form.technologies}
                onChange={(event) => updateForm("technologies", event.target.value)}
                placeholder="React, TypeScript, NestJS"
              />
            </AdminFormField>

            <div className="grid gap-3 md:grid-cols-2">
              <AdminFormField id="project-github" label="GitHub Link">
                <Input
                  id="project-github"
                  value={form.githubLink}
                  onChange={(event) => updateForm("githubLink", event.target.value)}
                  placeholder="https://github.com/..."
                />
              </AdminFormField>
              <AdminFormField id="project-live" label="Live Demo Link">
                <Input
                  id="project-live"
                  value={form.liveDemoLink}
                  onChange={(event) => updateForm("liveDemoLink", event.target.value)}
                  placeholder="https://..."
                />
              </AdminFormField>
            </div>

            <AdminFormField id="project-thumbnail" label="Thumbnail URL">
              <Input
                id="project-thumbnail"
                value={form.thumbnail}
                onChange={(event) => updateForm("thumbnail", event.target.value)}
                placeholder="/uploads/projects/thumbnail.png"
              />
            </AdminFormField>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(event) => updateForm("isPublic", event.target.checked)}
              />
              Make project public
            </label>

            <AdminFormError message={formError} />
          </AdminFormGrid>

          <DialogFooter showCloseButton>
            <Button onClick={() => void handleSaveProject()} disabled={isMutating}>
              {isMutating
                ? "Saving..."
                : editingProjectId
                  ? "Save Changes"
                  : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
