import { z } from "zod"

import { apiClient } from "@/api/client"
import { extractApiData, getHttpErrorMessage } from "@/api/http"
import type { UploadedFile, UploadFilePayload } from "@/types/file"

const uploadedFileSchema = z.object({
  id: z.string().or(z.number()).optional(),
  file_path: z.string().optional(),
  filePath: z.string().optional(),
  path: z.string().optional(),
  url: z.string().optional(),
  file_name: z.string().optional(),
  fileName: z.string().optional(),
  original_name: z.string().optional(),
  originalName: z.string().optional(),
  mime_type: z.string().optional(),
  mimeType: z.string().optional(),
})

function mapUploadedFile(rawValue: unknown): UploadedFile {
  const raw = uploadedFileSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    filePath: raw.file_path ?? raw.filePath ?? raw.path ?? raw.url ?? "",
    fileName: raw.file_name ?? raw.fileName ?? raw.original_name ?? raw.originalName ?? "",
    mimeType: raw.mime_type ?? raw.mimeType ?? "application/octet-stream",
  }
}

export const filesApi = {
  async upload(file: File, payload: UploadFilePayload): Promise<UploadedFile> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("entityType", payload.entityType)
      formData.append("entityId", payload.entityId)
      formData.append("isPublic", String(payload.isPublic))

      const response = await apiClient.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return mapUploadedFile(extractApiData(response.data))
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
