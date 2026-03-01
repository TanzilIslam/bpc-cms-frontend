export type TABatchStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"

export type TABatch = {
  id: string
  batchName: string
  batchCode: string
  courseTitle: string
  schedule: string
  status: TABatchStatus
  studentCount: number
}

export type TABatchStudent = {
  id: string
  fullName: string
  email: string
  phone: string
  progressPercentage: number
}

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"

export type AttendanceRecordInput = {
  studentId: string
  status: AttendanceStatus
  notes?: string
}

export type AttendancePayload = {
  batchId: string
  classDate: string
  classTopic: string
  records: AttendanceRecordInput[]
}

export type TASubmissionStatus = "SUBMITTED" | "GRADED" | "REVISION_NEEDED"

export type TASubmission = {
  id: string
  assignmentId: string
  assignmentTitle: string
  studentId: string
  studentName: string
  submittedAt: string | null
  status: TASubmissionStatus
  score: number | null
  feedback: string | null
}

export type GradeAssignmentPayload = {
  submissionId?: string
  studentId?: string
  score: number
  feedback?: string
  status?: "GRADED" | "REVISION_NEEDED"
}
