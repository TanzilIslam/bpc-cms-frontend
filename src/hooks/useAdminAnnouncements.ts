import { useCallback } from "react"

import { adminApi } from "@/api/admin.api"
import { useAsyncMutation, useAsyncResource } from "@/hooks/useAsyncState"
import type {
  AdminAnnouncement,
  AdminAnnouncementPayload,
} from "@/types/admin"

type AdminAnnouncementsState = {
  announcements: AdminAnnouncement[]
  isLoading: boolean
  isMutating: boolean
  error: string | null
  actionError: string | null
  reload: () => Promise<void>
  createAnnouncement: (payload: AdminAnnouncementPayload) => Promise<void>
  updateAnnouncement: (
    announcementId: string,
    payload: Partial<AdminAnnouncementPayload>
  ) => Promise<void>
  setPublished: (announcementId: string, isPublished: boolean) => Promise<void>
}

export function useAdminAnnouncements(): AdminAnnouncementsState {
  const loadAnnouncements = useCallback(() => adminApi.getAnnouncements(), [])
  const { data: announcements, setData: setAnnouncements, isLoading, error, reload } =
    useAsyncResource<AdminAnnouncement[]>({
      initialData: [],
      load: loadAnnouncements,
      fallbackError: "Failed to load announcements.",
    })
  const { isMutating, actionError, runMutation } = useAsyncMutation()

  const createAnnouncement = useCallback(async (payload: AdminAnnouncementPayload) => {
    await runMutation(async () => {
      const created = await adminApi.createAnnouncement(payload)
      setAnnouncements((prev) => [created, ...prev])
    }, "Failed to create announcement.")
  }, [runMutation, setAnnouncements])

  const updateAnnouncement = useCallback(
    async (announcementId: string, payload: Partial<AdminAnnouncementPayload>) => {
      await runMutation(async () => {
        const updated = await adminApi.updateAnnouncement(announcementId, payload)
        setAnnouncements((prev) =>
          prev.map((announcement) =>
            announcement.id === announcementId ? updated : announcement
          )
        )
      }, "Failed to update announcement.")
    },
    [runMutation, setAnnouncements]
  )

  const setPublished = useCallback(async (announcementId: string, isPublished: boolean) => {
    await runMutation(async () => {
      const updated = await adminApi.setAnnouncementPublished(announcementId, isPublished)
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === announcementId ? updated : announcement
        )
      )
    }, "Failed to update publish status.")
  }, [runMutation, setAnnouncements])

  return {
    announcements,
    isLoading,
    isMutating,
    error,
    actionError,
    reload,
    createAnnouncement,
    updateAnnouncement,
    setPublished,
  }
}
