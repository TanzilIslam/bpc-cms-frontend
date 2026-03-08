export type BatchStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"
export type AccessType = "LIVE" | "RECORDED" | "BOTH"

export type PublicBatch = {
  id: string
  courseId: string
  courseName: string
  batchName: string
  batchCode: string
  startDate: string | null
  endDate: string | null
  schedule: string | null
  maxStudents: number
  status: BatchStatus
  meetingLink: string | null
  isFree: boolean
  accessType: AccessType
}
