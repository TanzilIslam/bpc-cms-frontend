import { z } from "zod"

import { apiClient } from "@/api/client"
import { extractApiData, getHttpErrorMessage } from "@/api/http"
import { deleteWithFallback } from "@/api/request"
import type { FileEntityType, FileType, UploadedFile, UploadFilePayload } from "@/types/file"

const fileEntityTypeSchema = z.enum([
  "PROFILE",
  "ASSIGNMENT",
  "PROJECT",
  "COURSE",
  "CERTIFICATE",
])
const fileTypeSchema = z.enum(["IMAGE", "VIDEO", "PDF", "ZIP", "OTHER"])

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
  file_size: z.number().or(z.string()).nullable().optional(),
  fileSize: z.number().or(z.string()).nullable().optional(),
  entity_type: fileEntityTypeSchema.optional(),
  entityType: fileEntityTypeSchema.optional(),
  entity_id: z.string().or(z.number()).nullable().optional(),
  entityId: z.string().or(z.number()).nullable().optional(),
  is_public: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  file_type: fileTypeSchema.optional(),
  fileType: fileTypeSchema.optional(),
  uploaded_at: z.string().nullable().optional(),
  uploadedAt: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
})

function mapUploadedFile(rawValue: unknown): UploadedFile {
  const raw = uploadedFileSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    filePath: raw.file_path ?? raw.filePath ?? raw.path ?? raw.url ?? "",
    fileName: raw.file_name ?? raw.fileName ?? raw.original_name ?? raw.originalName ?? "",
    mimeType: raw.mime_type ?? raw.mimeType ?? "application/octet-stream",
    fileSize:
      raw.file_size !== null && raw.file_size !== undefined
        ? Number(raw.file_size)
        : raw.fileSize !== null && raw.fileSize !== undefined
          ? Number(raw.fileSize)
          : null,
    entityType: (raw.entity_type ?? raw.entityType ?? null) as FileEntityType | null,
    entityId:
      raw.entity_id !== null && raw.entity_id !== undefined
        ? String(raw.entity_id)
        : raw.entityId !== null && raw.entityId !== undefined
          ? String(raw.entityId)
          : null,
    isPublic: raw.is_public ?? raw.isPublic ?? false,
    fileType: (raw.file_type ?? raw.fileType ?? null) as FileType | null,
    uploadedAt:
      raw.uploaded_at ?? raw.uploadedAt ?? raw.created_at ?? raw.createdAt ?? null,
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
        headers: { "Content-Type": "multipart/form-data" },
      })

      return mapUploadedFile(extractApiData(response.data))
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async getById(fileId: string): Promise<UploadedFile> {
    try {
      const response = await apiClient.get(`/files/${fileId}`)
      return mapUploadedFile(extractApiData(response.data))
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async deleteById(fileId: string): Promise<void> {
    try {
      await deleteWithFallback([`/files/${fileId}`])
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
