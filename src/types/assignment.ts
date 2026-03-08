export type AssignmentType = "PROJECT" | "QUIZ" | "CODE" | "WRITTEN"
export type SubmissionStatus = "NOT_SUBMITTED" | "SUBMITTED" | "GRADED" | "REVISION_NEEDED"

export type StudentAssignment = {
  id: string
  title: string
  description: string
  assignmentType: string
  maxScore: number
  dueDate: string | null
  status: SubmissionStatus
  score: number | null
  feedback: string | null
}

export type AssignmentSubmissionPayload = {
  filePaths: string[]
  githubLink?: string
  liveDemoLink?: string
  notes?: string
}

export type AssignmentDetail = {
  id: string
  courseContentId: string
  title: string
  description: string
  assignmentType: AssignmentType
  maxScore: number
  dueDate: string | null
  requiredFiles: string[]
  submissionInstructions: string | null
}

export type SubmissionDetail = {
  id: string
  assignmentId: string
  assignmentTitle: string
  studentId: string
  studentName: string
  filePaths: string[]
  githubLink: string | null
  liveDemoLink: string | null
  notes: string | null
  submittedAt: string | null
  status: SubmissionStatus
  score: number | null
  feedback: string | null
  gradedBy: string | null
  gradedAt: string | null
}
