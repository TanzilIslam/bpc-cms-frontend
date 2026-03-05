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
