import { z } from "zod"

import { extractApiItems, getHttpErrorMessage } from "@/api/http"
import { getWithFallback } from "@/api/request"
import type {
  CertificateVerification,
  StudentCertificate,
} from "@/types/certificate"

const certificateRawSchema = z.object({
  certificate_code: z.string().optional(),
  certificateCode: z.string().optional(),
  student_name: z.string().optional(),
  studentName: z.string().optional(),
  course_title: z.string().optional(),
  courseTitle: z.string().optional(),
  grade: z.string().optional(),
  issue_date: z.string().optional(),
  issueDate: z.string().optional(),
  is_verified: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  skills_earned: z.array(z.string()).optional(),
  skillsEarned: z.array(z.string()).optional(),
  student: z
    .object({
      full_name: z.string().optional(),
      fullName: z.string().optional(),
    })
    .optional(),
  course: z
    .object({
      title: z.string().optional(),
    })
    .optional(),
  pdf_path: z.string().nullable().optional(),
  pdfPath: z.string().nullable().optional(),
  verification_link: z.string().nullable().optional(),
  verificationLink: z.string().nullable().optional(),
})

function mapCertificate(rawValue: unknown): CertificateVerification {
  const raw = certificateRawSchema.parse(rawValue)

  return {
    certificateCode: raw.certificate_code ?? raw.certificateCode ?? "-",
    studentName:
      raw.student_name ?? raw.studentName ?? raw.student?.full_name ?? raw.student?.fullName ?? "-",
    courseTitle: raw.course_title ?? raw.courseTitle ?? raw.course?.title ?? "-",
    grade: raw.grade ?? "-",
    issueDate: raw.issue_date ?? raw.issueDate ?? null,
    isVerified: raw.is_verified ?? raw.isVerified ?? false,
    skillsEarned: raw.skills_earned ?? raw.skillsEarned ?? [],
  }
}

function mapStudentCertificate(rawValue: unknown): StudentCertificate {
  const mapped = mapCertificate(rawValue)
  const raw = certificateRawSchema.parse(rawValue)

  return {
    ...mapped,
    pdfPath: raw.pdf_path ?? raw.pdfPath ?? null,
    verificationLink: raw.verification_link ?? raw.verificationLink ?? null,
  }
}

export const certificatesApi = {
  async verifyByCode(code: string): Promise<CertificateVerification> {
    const normalizedCode = code.trim()
    if (!normalizedCode) {
      throw new Error("Certificate code is required.")
    }

    const encodedCode = encodeURIComponent(normalizedCode)
    const paths = [
      `/certificates/verify/${encodedCode}`,
      `/certificates/verify?code=${encodedCode}`,
    ]

    try {
      const payload = await getWithFallback(paths)
      return mapCertificate(payload)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async getMine(): Promise<StudentCertificate | null> {
    try {
      const payload = await getWithFallback(["/students/me/certificate", "/certificates/me"])
      if (!payload) {
        return null
      }

      const items = extractApiItems(payload)
      if (items.length > 0) {
        return mapStudentCertificate(items[0])
      }

      return mapStudentCertificate(payload)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },
}
