export type FileEntityType = "PROFILE" | "ASSIGNMENT" | "PROJECT" | "COURSE" | "CERTIFICATE"

export type UploadFilePayload = {
  entityType: FileEntityType
  entityId: string
  isPublic: boolean
}

export type UploadedFile = {
  id: string
  filePath: string
  fileName: string
  mimeType: string
}
