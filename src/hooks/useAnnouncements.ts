import { useCallback } from "react"

import { announcementsApi } from "@/api/announcements.api"
import { useAsyncResource } from "@/hooks/useAsyncState"
import type { PublicAnnouncement } from "@/types/announcement"

type AnnouncementsState = {
  announcements: PublicAnnouncement[]
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useAnnouncements(): AnnouncementsState {
  const loadAnnouncements = useCallback(() => announcementsApi.getPublished(), [])
  const { data: announcements, isLoading, error, reload } = useAsyncResource<
    PublicAnnouncement[]
  >({
    initialData: [],
    load: loadAnnouncements,
    fallbackError: "Failed to load announcements.",
  })

  return {
    announcements,
    isLoading,
    error,
    reload,
  }
}
