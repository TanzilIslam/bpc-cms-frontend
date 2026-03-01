export type CertificateVerification = {
  certificateCode: string
  studentName: string
  courseTitle: string
  grade: string
  issueDate: string | null
  isVerified: boolean
  skillsEarned: string[]
}

export type StudentCertificate = CertificateVerification & {
  pdfPath: string | null
  verificationLink: string | null
}
