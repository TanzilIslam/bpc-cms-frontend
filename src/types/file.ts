export type FileEntityType = "PROFILE" | "ASSIGNMENT" | "PROJECT" | "COURSE" | "CERTIFICATE"

export type UploadFilePayload = {
  entityType: FileEntityType
  entityId: string
  isPublic: boolean
}

export type FileType = "IMAGE" | "VIDEO" | "PDF" | "ZIP" | "OTHER"

export type UploadedFile = {
  id: string
  filePath: string
  fileName: string
  mimeType: string
  fileSize: number | null
  entityType: FileEntityType | null
  entityId: string | null
  isPublic: boolean
  fileType: FileType | null
  uploadedAt: string | null
}
