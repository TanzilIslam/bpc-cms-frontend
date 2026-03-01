import { useMemo, useState } from "react"

import {
  EmptyStatePanel,
  InlineErrorMessage,
  PageErrorState,
  PageLoadingState,
} from "@/components/shared/AsyncStates"
import { AdminFormError, AdminFormField, AdminFormGrid } from "@/components/shared/AdminForm"
import { AdminPageHeader } from "@/components/shared/AdminPageHeader"
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHeadCell,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/shared/AdminTable"
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
import { useAdminAnnouncements } from "@/hooks/useAdminAnnouncements"
import {
  ANNOUNCEMENT_AUDIENCE_OPTIONS,
  ANNOUNCEMENT_FILTER_OPTIONS,
  ANNOUNCEMENT_PRIORITY_OPTIONS,
  NATIVE_SELECT_CLASS_NAME,
  type AnnouncementFilterOption,
} from "@/lib/admin-options"
import { publishedBadgeVariant } from "@/lib/admin-badges"
import { formatDate } from "@/lib/formatters"
import type {
  AdminAnnouncement,
  AdminAnnouncementAudience,
  AdminAnnouncementPayload,
  AdminAnnouncementPriority,
} from "@/types/admin"

type AnnouncementFormState = {
  title: string
  content: string
  targetAudience: AdminAnnouncementAudience
  batchId: string
  courseId: string
  priority: AdminAnnouncementPriority
  isPublished: boolean
  publishDate: string
}

const emptyForm: AnnouncementFormState = {
  title: "",
  content: "",
  targetAudience: "ALL",
  batchId: "",
  courseId: "",
  priority: "MEDIUM",
  isPublished: true,
  publishDate: "",
}

function toPayload(form: AnnouncementFormState): AdminAnnouncementPayload {
  return {
    title: form.title.trim(),
    content: form.content.trim(),
    targetAudience: form.targetAudience,
    batchId: form.batchId.trim() || undefined,
    courseId: form.courseId.trim() || undefined,
    priority: form.priority,
    isPublished: form.isPublished,
    publishDate: form.publishDate || undefined,
  }
}

function toForm(announcement: AdminAnnouncement): AnnouncementFormState {
  return {
    title: announcement.title,
    content: announcement.content,
    targetAudience: announcement.targetAudience,
    batchId: announcement.batchId ?? "",
    courseId: announcement.courseId ?? "",
    priority: announcement.priority,
    isPublished: announcement.isPublished,
    publishDate: announcement.publishDate ? announcement.publishDate.slice(0, 10) : "",
  }
}

export function AdminAnnouncementsPage() {
  const {
    announcements,
    isLoading,
    isMutating,
    error,
    actionError,
    reload,
    createAnnouncement,
    updateAnnouncement,
    setPublished,
  } = useAdminAnnouncements()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<AnnouncementFilterOption>("ALL")
  const [form, setForm] = useState<AnnouncementFormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const filteredAnnouncements = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return announcements.filter((announcement) => {
      const matchesFilter =
        filter === "ALL"
          ? true
          : filter === "PUBLISHED"
            ? announcement.isPublished
            : !announcement.isPublished
      const matchesSearch =
        normalizedSearch.length === 0
          ? true
          : announcement.title.toLowerCase().includes(normalizedSearch) ||
            announcement.content.toLowerCase().includes(normalizedSearch)

      return matchesFilter && matchesSearch
    })
  }, [announcements, filter, searchTerm])

  function updateForm<K extends keyof AnnouncementFormState>(
    key: K,
    value: AnnouncementFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function openCreateDialog() {
    setEditingId(null)
    setForm(emptyForm)
    setFormError(null)
    setDialogOpen(true)
  }

  function openEditDialog(announcement: AdminAnnouncement) {
    setEditingId(announcement.id)
    setForm(toForm(announcement))
    setFormError(null)
    setDialogOpen(true)
  }

  async function handleSaveAnnouncement() {
    setFormError(null)
    const payload = toPayload(form)

    if (!payload.title) {
      setFormError("Title is required.")
      return
    }

    if (!payload.content) {
      setFormError("Content is required.")
      return
    }

    try {
      if (editingId) {
        await updateAnnouncement(editingId, payload)
      } else {
        await createAnnouncement(payload)
      }

      setDialogOpen(false)
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to save announcement."
      setFormError(message)
    }
  }

  async function handlePublishToggle(announcement: AdminAnnouncement) {
    try {
      await setPublished(announcement.id, !announcement.isPublished)
    } catch {
      // Error surfaced through actionError from hook.
    }
  }

  if (isLoading) {
    return <PageLoadingState message="Loading announcements..." />
  }

  if (error) {
    return <PageErrorState message={error} onRetry={() => void reload()} />
  }

  return (
    <section className="space-y-5">
      <AdminPageHeader
        title="Announcements"
        actions={<Button onClick={openCreateDialog}>Create Announcement</Button>}
      />

      <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_180px]">
        <Input
          placeholder="Search by title/content"
          aria-label="Search announcements"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as AnnouncementFilterOption)}
          aria-label="Filter announcements by status"
          className={NATIVE_SELECT_CLASS_NAME}
        >
          {ANNOUNCEMENT_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <InlineErrorMessage message={actionError} />

      {filteredAnnouncements.length === 0 ? (
        <EmptyStatePanel
          title="No announcements found"
          description={
            searchTerm.trim().length > 0 || filter !== "ALL"
              ? "No announcement matched your current filter/search."
              : "Create an announcement to communicate with students and batches."
          }
          action={
            searchTerm.trim().length > 0 || filter !== "ALL" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setFilter("ALL")
                }}
              >
                Reset Filters
              </Button>
            ) : (
              <Button size="sm" onClick={openCreateDialog}>
                Create Announcement
              </Button>
            )
          }
        />
      ) : (
        <AdminTable minWidthClass="min-w-[940px]">
          <AdminTableHeader>
            <tr>
              <AdminTableHeadCell>Title</AdminTableHeadCell>
              <AdminTableHeadCell>Audience</AdminTableHeadCell>
              <AdminTableHeadCell>Priority</AdminTableHeadCell>
              <AdminTableHeadCell>Status</AdminTableHeadCell>
              <AdminTableHeadCell>Publish Date</AdminTableHeadCell>
              <AdminTableHeadCell>Actions</AdminTableHeadCell>
            </tr>
          </AdminTableHeader>
          <AdminTableBody>
            {filteredAnnouncements.map((announcement) => (
              <AdminTableRow key={announcement.id}>
                <AdminTableCell>
                  <p className="font-medium">{announcement.title}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {announcement.content}
                  </p>
                </AdminTableCell>
                <AdminTableCell>{announcement.targetAudience}</AdminTableCell>
                <AdminTableCell>
                  <Badge variant="outline">{announcement.priority}</Badge>
                </AdminTableCell>
                <AdminTableCell>
                  <Badge variant={publishedBadgeVariant(announcement.isPublished)}>
                    {announcement.isPublished ? "PUBLISHED" : "DRAFT"}
                  </Badge>
                </AdminTableCell>
                <AdminTableCell>{formatDate(announcement.publishDate)}</AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(announcement)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void handlePublishToggle(announcement)}
                      disabled={isMutating}
                    >
                      {announcement.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setEditingId(null)
            setForm(emptyForm)
            setFormError(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Announcement" : "Create Announcement"}</DialogTitle>
            <DialogDescription>
              Write an announcement for all students or a targeted audience.
            </DialogDescription>
          </DialogHeader>

          <AdminFormGrid>
            <AdminFormField id="announcement-title" label="Title">
              <Input
                id="announcement-title"
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
              />
            </AdminFormField>

            <AdminFormField id="announcement-content" label="Content">
              <Textarea
                id="announcement-content"
                rows={5}
                value={form.content}
                onChange={(event) => updateForm("content", event.target.value)}
              />
            </AdminFormField>

            <div className="grid gap-3 md:grid-cols-3">
              <AdminFormField id="announcement-audience" label="Audience">
                <select
                  id="announcement-audience"
                  aria-label="Announcement target audience"
                  value={form.targetAudience}
                  onChange={(event) =>
                    updateForm(
                      "targetAudience",
                      event.target.value as AdminAnnouncementAudience
                    )
                  }
                  className={NATIVE_SELECT_CLASS_NAME}
                >
                  {ANNOUNCEMENT_AUDIENCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </AdminFormField>
              <AdminFormField id="announcement-priority" label="Priority">
                <select
                  id="announcement-priority"
                  aria-label="Announcement priority"
                  value={form.priority}
                  onChange={(event) =>
                    updateForm("priority", event.target.value as AdminAnnouncementPriority)
                  }
                  className={NATIVE_SELECT_CLASS_NAME}
                >
                  {ANNOUNCEMENT_PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </AdminFormField>
              <AdminFormField id="announcement-publish-date" label="Publish Date">
                <Input
                  id="announcement-publish-date"
                  type="date"
                  value={form.publishDate}
                  onChange={(event) => updateForm("publishDate", event.target.value)}
                />
              </AdminFormField>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <AdminFormField id="announcement-batch" label="Batch ID (optional)">
                <Input
                  id="announcement-batch"
                  value={form.batchId}
                  onChange={(event) => updateForm("batchId", event.target.value)}
                />
              </AdminFormField>
              <AdminFormField id="announcement-course" label="Course ID (optional)">
                <Input
                  id="announcement-course"
                  value={form.courseId}
                  onChange={(event) => updateForm("courseId", event.target.value)}
                />
              </AdminFormField>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                aria-label="Publish announcement immediately"
                checked={form.isPublished}
                onChange={(event) => updateForm("isPublished", event.target.checked)}
              />
              Publish immediately
            </label>

            <AdminFormError message={formError} />
          </AdminFormGrid>

          <DialogFooter showCloseButton>
            <Button onClick={() => void handleSaveAnnouncement()} disabled={isMutating}>
              {isMutating ? "Saving..." : editingId ? "Save Changes" : "Create Announcement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
