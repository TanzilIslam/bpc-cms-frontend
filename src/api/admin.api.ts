import { z } from "zod"

import { apiClient } from "@/api/client"
import { extractApiData, getHttpErrorMessage, mapApiItems } from "@/api/http"
import { deleteWithFallback, getWithFallback, postWithFallback, putWithFallback } from "@/api/request"
import type { Course } from "@/types/course"
import type {
  AdminAnnouncement,
  AdminAnnouncementAudience,
  AdminAnnouncementPayload,
  AdminAnnouncementPriority,
  AdminAnalyticsCourses,
  AdminAnalyticsRevenue,
  AdminAnalyticsStudents,
  AdminAssignment,
  AdminAssignmentType,
  AdminAttendanceStatus,
  AdminBatch,
  AdminBatchAttendance,
  AdminBatchStatus,
  AdminBatchStudent,
  AdminCertificate,
  AdminConvertEnrollmentRequestPayload,
  AdminCourseAnalyticsItem,
  AdminCreateAssignmentPayload,
  AdminCreateEnrollmentPayload,
  AdminCreateBatchPayload,
  AdminCreateCoursePayload,
  AdminCreateCourseContentPayload,
  AdminCreateExpensePayload,
  AdminCreateFinancialGoalPayload,
  AdminEnrollment,
  AdminEnrollmentPaymentStatus,
  AdminEnrollmentStatus,
  AdminEnrollmentRequest,
  AdminExpense,
  AdminExpenseCategory,
  AdminFinancialGoal,
  AdminFinancialGoalStatus,
  AdminFinancialSummary,
  AdminGenerateCertificatePayload,
  AdminGradeSubmissionPayload,
  AdminOverview,
  AdminPayment,
  AdminRecordPaymentPayload,
  AdminPaymentStatus,
  AdminRevenueDataPoint,
  AdminStudent,
  AdminStudentDataPoint,
  AdminStudentStatus,
  AdminSubmission,
  AdminSubmissionStatus,
  AdminTestimonial,
  AdminUpdateBatchPayload,
  AdminUpdateCoursePayload,
  AdminUpdateFinancialGoalPayload,
  AdminUser,
  AssignTaPayload,
  EnrollmentRequestStatus,
  UpdateEnrollmentStatusPayload,
  UpdateUserRolePayload,
} from "@/types/admin"

const studentStatusSchema = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"])
const paymentStatusSchema = z.enum(["PENDING", "CONFIRMED", "FAILED", "REFUNDED"])
const batchStatusSchema = z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"])
const enrollmentStatusSchema = z.enum([
  "PENDING",
  "ACTIVE",
  "COMPLETED",
  "DROPPED",
  "SUSPENDED",
])
const enrollmentPaymentStatusSchema = z.enum(["UNPAID", "PARTIAL", "FULL"])
const enrollmentRequestStatusSchema = z.enum([
  "PENDING",
  "CONTACTED",
  "ENROLLED",
  "REJECTED",
])
const expenseCategorySchema = z.enum([
  "INTERNET",
  "ELECTRICITY",
  "EQUIPMENT",
  "MARKETING",
  "TA_PAYMENT",
  "OTHER",
])
const financialGoalStatusSchema = z.enum(["ACTIVE", "ACHIEVED", "CANCELLED"])
const announcementPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"])
const announcementAudienceSchema = z.enum(["ALL", "BATCH_SPECIFIC", "COURSE_SPECIFIC"])

const studentSchema = z.object({
  id: z.string().or(z.number()).optional(),
  full_name: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
  status: studentStatusSchema.optional(),
  created_at: z.string().optional(),
  createdAt: z.string().optional(),
})

const paymentSchema = z.object({
  id: z.string().or(z.number()).optional(),
  amount: z.number().or(z.string()).optional(),
  payment_method: z.string().optional(),
  paymentMethod: z.string().optional(),
  status: paymentStatusSchema.optional(),
  payment_date: z.string().optional(),
  paymentDate: z.string().optional(),
  student_name: z.string().optional(),
  studentName: z.string().optional(),
  student: z
    .object({
      full_name: z.string().optional(),
      fullName: z.string().optional(),
    })
    .optional(),
})

const expenseSchema = z.object({
  id: z.string().or(z.number()).optional(),
  expense_date: z.string().optional(),
  expenseDate: z.string().optional(),
  category: expenseCategorySchema.optional(),
  amount: z.number().or(z.string()).optional(),
  description: z.string().optional(),
})

const financialGoalSchema = z.object({
  id: z.string().or(z.number()).optional(),
  goal_name: z.string().optional(),
  goalName: z.string().optional(),
  target_amount: z.number().or(z.string()).optional(),
  targetAmount: z.number().or(z.string()).optional(),
  current_amount: z.number().or(z.string()).optional(),
  currentAmount: z.number().or(z.string()).optional(),
  deadline: z.string().optional(),
  status: financialGoalStatusSchema.optional(),
})

const enrollmentSchema = z.object({
  id: z.string().or(z.number()).optional(),
  student_id: z.string().or(z.number()).optional(),
  studentId: z.string().or(z.number()).optional(),
  enrollment_status: enrollmentStatusSchema.optional(),
  enrollmentStatus: enrollmentStatusSchema.optional(),
  payment_status: enrollmentPaymentStatusSchema.optional(),
  paymentStatus: enrollmentPaymentStatusSchema.optional(),
  amount_paid: z.number().or(z.string()).optional(),
  amountPaid: z.number().or(z.string()).optional(),
  total_fee: z.number().or(z.string()).optional(),
  totalFee: z.number().or(z.string()).optional(),
  student_name: z.string().optional(),
  studentName: z.string().optional(),
  course_title: z.string().optional(),
  courseTitle: z.string().optional(),
  batch_name: z.string().optional(),
  batchName: z.string().optional(),
  student: z
    .object({
      id: z.string().or(z.number()).optional(),
      full_name: z.string().optional(),
      fullName: z.string().optional(),
    })
    .optional(),
  course: z
    .object({
      title: z.string().optional(),
    })
    .optional(),
  batch: z
    .object({
      batch_name: z.string().optional(),
      batchName: z.string().optional(),
    })
    .optional(),
})

const courseSchema = z.object({
  id: z.string().or(z.number()).optional(),
  title: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  duration_months: z.number().optional(),
  durationMonths: z.number().optional(),
  price: z.number().or(z.string()).optional(),
  difficulty_level: z.string().optional(),
  difficultyLevel: z.string().optional(),
  skills_covered: z.array(z.string()).optional(),
  skillsCovered: z.array(z.string()).optional(),
  thumbnail: z.string().nullable().optional(),
  is_published: z.boolean().optional(),
  isPublished: z.boolean().optional(),
})

const batchSchema = z.object({
  id: z.string().or(z.number()).optional(),
  course_id: z.string().or(z.number()).optional(),
  courseId: z.string().or(z.number()).optional(),
  batch_name: z.string().optional(),
  batchName: z.string().optional(),
  batch_code: z.string().optional(),
  batchCode: z.string().optional(),
  schedule: z.string().optional(),
  status: batchStatusSchema.optional(),
  max_students: z.number().optional(),
  maxStudents: z.number().optional(),
  current_enrollment: z.number().optional(),
  currentEnrollment: z.number().optional(),
  course_title: z.string().optional(),
  courseTitle: z.string().optional(),
  course: z
    .object({
      title: z.string().optional(),
    })
    .optional(),
})

const enrollmentRequestSchema = z.object({
  id: z.string().or(z.number()).optional(),
  full_name: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  interested_course: z.string().optional(),
  interestedCourse: z.string().optional(),
  has_laptop: z.boolean().optional(),
  hasLaptop: z.boolean().optional(),
  laptop_specs: z.string().nullable().optional(),
  laptopSpecs: z.string().nullable().optional(),
  has_internet: z.boolean().optional(),
  hasInternet: z.boolean().optional(),
  why_join: z.string().nullable().optional(),
  whyJoin: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: enrollmentRequestStatusSchema.optional(),
  created_at: z.string().optional(),
  createdAt: z.string().optional(),
  updated_at: z.string().optional(),
  updatedAt: z.string().optional(),
})

const certificateSchema = z.object({
  id: z.string().or(z.number()).optional(),
  enrollment_id: z.string().or(z.number()).optional(),
  enrollmentId: z.string().or(z.number()).optional(),
  certificate_code: z.string().optional(),
  certificateCode: z.string().optional(),
  grade: z.string().optional(),
  issue_date: z.string().optional(),
  issueDate: z.string().optional(),
  is_verified: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  student_name: z.string().optional(),
  studentName: z.string().optional(),
  course_title: z.string().optional(),
  courseTitle: z.string().optional(),
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
})

const announcementSchema = z.object({
  id: z.string().or(z.number()).optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  target_audience: announcementAudienceSchema.optional(),
  targetAudience: announcementAudienceSchema.optional(),
  batch_id: z.string().or(z.number()).nullable().optional(),
  batchId: z.string().or(z.number()).nullable().optional(),
  course_id: z.string().or(z.number()).nullable().optional(),
  courseId: z.string().or(z.number()).nullable().optional(),
  priority: announcementPrioritySchema.optional(),
  is_published: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  publish_date: z.string().nullable().optional(),
  publishDate: z.string().nullable().optional(),
  created_at: z.string().optional(),
  createdAt: z.string().optional(),
})

const testimonialSchema = z.object({
  id: z.string().or(z.number()).optional(),
  student_id: z.string().or(z.number()).optional(),
  studentId: z.string().or(z.number()).optional(),
  course_id: z.string().or(z.number()).optional(),
  courseId: z.string().or(z.number()).optional(),
  rating: z.number().optional(),
  review: z.string().optional(),
  is_approved: z.boolean().optional(),
  isApproved: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  created_at: z.string().optional(),
  createdAt: z.string().optional(),
  student_name: z.string().optional(),
  studentName: z.string().optional(),
  course_title: z.string().optional(),
  courseTitle: z.string().optional(),
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
})

const attendanceStatusSchema = z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"])
const assignmentTypeSchema = z.enum(["PROJECT", "QUIZ", "CODE", "WRITTEN"])

const userSchema = z.object({
  id: z.string().or(z.number()).optional(),
  full_name: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().nullable().optional(),
  role: z.string().optional(),
  status: studentStatusSchema.optional(),
  address: z.string().nullable().optional(),
  created_at: z.string().optional(),
  createdAt: z.string().optional(),
})

const batchStudentSchema = z.object({
  id: z.string().or(z.number()).optional(),
  full_name: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  enrollment_id: z.string().or(z.number()).optional(),
  enrollmentId: z.string().or(z.number()).optional(),
  enrollment_status: enrollmentStatusSchema.optional(),
  enrollmentStatus: enrollmentStatusSchema.optional(),
  payment_status: enrollmentPaymentStatusSchema.optional(),
  paymentStatus: enrollmentPaymentStatusSchema.optional(),
  amount_paid: z.number().or(z.string()).optional(),
  amountPaid: z.number().or(z.string()).optional(),
  total_fee: z.number().or(z.string()).optional(),
  totalFee: z.number().or(z.string()).optional(),
  progress_percentage: z.number().optional(),
  progressPercentage: z.number().optional(),
  enrollment: z
    .object({
      id: z.string().or(z.number()).optional(),
      enrollment_status: enrollmentStatusSchema.optional(),
      enrollmentStatus: enrollmentStatusSchema.optional(),
      payment_status: enrollmentPaymentStatusSchema.optional(),
      paymentStatus: enrollmentPaymentStatusSchema.optional(),
      amount_paid: z.number().or(z.string()).optional(),
      amountPaid: z.number().or(z.string()).optional(),
      total_fee: z.number().or(z.string()).optional(),
      totalFee: z.number().or(z.string()).optional(),
    })
    .optional(),
})

const batchAttendanceSchema = z.object({
  id: z.string().or(z.number()).optional(),
  student_id: z.string().or(z.number()).optional(),
  studentId: z.string().or(z.number()).optional(),
  student_name: z.string().optional(),
  studentName: z.string().optional(),
  student: z
    .object({ full_name: z.string().optional(), fullName: z.string().optional() })
    .optional(),
  class_date: z.string().optional(),
  classDate: z.string().optional(),
  class_topic: z.string().nullable().optional(),
  classTopic: z.string().nullable().optional(),
  status: attendanceStatusSchema.optional(),
  notes: z.string().nullable().optional(),
})

const assignmentSchema = z.object({
  id: z.string().or(z.number()).optional(),
  course_content_id: z.string().or(z.number()).optional(),
  courseContentId: z.string().or(z.number()).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  assignment_type: assignmentTypeSchema.optional(),
  assignmentType: assignmentTypeSchema.optional(),
  max_score: z.number().optional(),
  maxScore: z.number().optional(),
  due_date: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  required_files: z.array(z.string()).optional(),
  requiredFiles: z.array(z.string()).optional(),
  submission_instructions: z.string().nullable().optional(),
  submissionInstructions: z.string().nullable().optional(),
})

const submissionStatusSchema = z.enum(["SUBMITTED", "GRADED", "REVISION_NEEDED"])

const submissionSchema = z.object({
  id: z.string().or(z.number()).optional(),
  assignment_id: z.string().or(z.number()).optional(),
  assignmentId: z.string().or(z.number()).optional(),
  assignment_title: z.string().optional(),
  assignmentTitle: z.string().optional(),
  assignment: z.object({ title: z.string().optional() }).optional(),
  student_id: z.string().or(z.number()).optional(),
  studentId: z.string().or(z.number()).optional(),
  student_name: z.string().optional(),
  studentName: z.string().optional(),
  student: z.object({ full_name: z.string().optional(), fullName: z.string().optional() }).optional(),
  file_paths: z.array(z.string()).optional(),
  filePaths: z.array(z.string()).optional(),
  github_link: z.string().nullable().optional(),
  githubLink: z.string().nullable().optional(),
  live_demo_link: z.string().nullable().optional(),
  liveDemoLink: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  submitted_at: z.string().nullable().optional(),
  submittedAt: z.string().nullable().optional(),
  status: submissionStatusSchema.optional(),
  score: z.number().or(z.string()).nullable().optional(),
  feedback: z.string().nullable().optional(),
  graded_by: z.string().nullable().optional(),
  gradedBy: z.string().nullable().optional(),
  graded_at: z.string().nullable().optional(),
  gradedAt: z.string().nullable().optional(),
})

function mapStudent(rawValue: unknown): AdminStudent {
  const raw = studentSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    fullName: raw.full_name ?? raw.fullName ?? "Unknown Student",
    email: raw.email ?? "-",
    phone: raw.phone ?? "-",
    role: raw.role ?? "STUDENT",
    status: (raw.status ?? "ACTIVE") as AdminStudentStatus,
    createdAt: raw.created_at ?? raw.createdAt ?? null,
  }
}

function mapPayment(rawValue: unknown): AdminPayment {
  const raw = paymentSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    studentName:
      raw.student_name ??
      raw.studentName ??
      raw.student?.full_name ??
      raw.student?.fullName ??
      "Unknown Student",
    amount: Number(raw.amount ?? 0),
    paymentMethod: raw.payment_method ?? raw.paymentMethod ?? "UNKNOWN",
    status: (raw.status ?? "CONFIRMED") as AdminPaymentStatus,
    paymentDate: raw.payment_date ?? raw.paymentDate ?? null,
  }
}

function mapExpense(rawValue: unknown): AdminExpense {
  const raw = expenseSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    expenseDate: raw.expense_date ?? raw.expenseDate ?? null,
    category: (raw.category ?? "OTHER") as AdminExpenseCategory,
    amount: Number(raw.amount ?? 0),
    description: raw.description ?? "-",
  }
}

function mapFinancialGoal(rawValue: unknown): AdminFinancialGoal {
  const raw = financialGoalSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    goalName: raw.goal_name ?? raw.goalName ?? "Untitled Goal",
    targetAmount: Number(raw.target_amount ?? raw.targetAmount ?? 0),
    currentAmount: Number(raw.current_amount ?? raw.currentAmount ?? 0),
    deadline: raw.deadline ?? null,
    status: (raw.status ?? "ACTIVE") as AdminFinancialGoalStatus,
  }
}

function mapEnrollment(rawValue: unknown): AdminEnrollment {
  const raw = enrollmentSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    studentId: String(raw.student_id ?? raw.studentId ?? raw.student?.id ?? ""),
    studentName:
      raw.student_name ??
      raw.studentName ??
      raw.student?.full_name ??
      raw.student?.fullName ??
      "Unknown Student",
    courseTitle: raw.course_title ?? raw.courseTitle ?? raw.course?.title ?? "Unknown Course",
    batchName: raw.batch_name ?? raw.batchName ?? raw.batch?.batch_name ?? raw.batch?.batchName ?? "-",
    enrollmentStatus: (raw.enrollment_status ??
      raw.enrollmentStatus ??
      "PENDING") as AdminEnrollmentStatus,
    paymentStatus: (raw.payment_status ??
      raw.paymentStatus ??
      "UNPAID") as AdminEnrollmentPaymentStatus,
    amountPaid: Number(raw.amount_paid ?? raw.amountPaid ?? 0),
    totalFee: Number(raw.total_fee ?? raw.totalFee ?? 0),
  }
}

function mapCourse(rawValue: unknown): Course {
  const raw = courseSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    title: raw.title ?? "",
    slug: raw.slug ?? "",
    description: raw.description ?? "",
    durationMonths: raw.duration_months ?? raw.durationMonths ?? 0,
    price: Number(raw.price ?? 0),
    difficultyLevel: (raw.difficulty_level ?? raw.difficultyLevel ?? "BEGINNER") as
      | "BEGINNER"
      | "INTERMEDIATE"
      | "ADVANCED",
    skillsCovered: raw.skills_covered ?? raw.skillsCovered ?? [],
    thumbnail: raw.thumbnail ?? null,
    isPublished: raw.is_published ?? raw.isPublished ?? false,
  }
}

function mapBatch(rawValue: unknown): AdminBatch {
  const raw = batchSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    courseId: String(raw.course_id ?? raw.courseId ?? ""),
    batchName: raw.batch_name ?? raw.batchName ?? "Unnamed Batch",
    batchCode: raw.batch_code ?? raw.batchCode ?? "-",
    courseTitle: raw.course_title ?? raw.courseTitle ?? raw.course?.title ?? "Unknown Course",
    schedule: raw.schedule ?? "-",
    status: (raw.status ?? "UPCOMING") as AdminBatchStatus,
    maxStudents: raw.max_students ?? raw.maxStudents ?? 0,
    currentEnrollment: raw.current_enrollment ?? raw.currentEnrollment ?? 0,
  }
}

function mapEnrollmentRequest(rawValue: unknown): AdminEnrollmentRequest {
  const raw = enrollmentRequestSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    fullName: raw.full_name ?? raw.fullName ?? "Unknown Applicant",
    email: raw.email ?? "-",
    phone: raw.phone ?? "-",
    interestedCourse: raw.interested_course ?? raw.interestedCourse ?? "-",
    hasLaptop: raw.has_laptop ?? raw.hasLaptop ?? false,
    laptopSpecs: raw.laptop_specs ?? raw.laptopSpecs ?? null,
    hasInternet: raw.has_internet ?? raw.hasInternet ?? false,
    whyJoin: raw.why_join ?? raw.whyJoin ?? null,
    notes: raw.notes ?? null,
    status: (raw.status ?? "PENDING") as EnrollmentRequestStatus,
    createdAt: raw.created_at ?? raw.createdAt ?? null,
    updatedAt: raw.updated_at ?? raw.updatedAt ?? null,
  }
}

function mapCertificate(rawValue: unknown): AdminCertificate {
  const raw = certificateSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    enrollmentId: String(raw.enrollment_id ?? raw.enrollmentId ?? ""),
    certificateCode: raw.certificate_code ?? raw.certificateCode ?? "-",
    studentName:
      raw.student_name ??
      raw.studentName ??
      raw.student?.full_name ??
      raw.student?.fullName ??
      "Unknown Student",
    courseTitle: raw.course_title ?? raw.courseTitle ?? raw.course?.title ?? "Unknown Course",
    grade: raw.grade ?? "-",
    issueDate: raw.issue_date ?? raw.issueDate ?? null,
    isVerified: raw.is_verified ?? raw.isVerified ?? false,
  }
}

function mapAnnouncement(rawValue: unknown): AdminAnnouncement {
  const raw = announcementSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    title: raw.title ?? "Untitled Announcement",
    content: raw.content ?? "",
    targetAudience: (raw.target_audience ??
      raw.targetAudience ??
      "ALL") as AdminAnnouncementAudience,
    batchId:
      raw.batch_id === undefined || raw.batch_id === null ? null : String(raw.batch_id),
    courseId:
      raw.course_id === undefined || raw.course_id === null ? null : String(raw.course_id),
    priority: (raw.priority ?? "MEDIUM") as AdminAnnouncementPriority,
    isPublished: raw.is_published ?? raw.isPublished ?? false,
    publishDate: raw.publish_date ?? raw.publishDate ?? null,
    createdAt: raw.created_at ?? raw.createdAt ?? null,
  }
}

function mapTestimonial(rawValue: unknown): AdminTestimonial {
  const raw = testimonialSchema.parse(rawValue)

  return {
    id: String(raw.id ?? ""),
    studentName:
      raw.student_name ??
      raw.studentName ??
      raw.student?.full_name ??
      raw.student?.fullName ??
      "Unknown Student",
    courseTitle: raw.course_title ?? raw.courseTitle ?? raw.course?.title ?? "Unknown Course",
    rating: raw.rating ?? 0,
    review: raw.review ?? "",
    isApproved: raw.is_approved ?? raw.isApproved ?? false,
    isFeatured: raw.is_featured ?? raw.isFeatured ?? false,
    createdAt: raw.created_at ?? raw.createdAt ?? null,
  }
}

function mapUser(rawValue: unknown): AdminUser {
  const raw = userSchema.parse(rawValue)
  return {
    id: String(raw.id ?? ""),
    email: raw.email ?? "",
    fullName: raw.full_name ?? raw.fullName ?? "",
    phone: raw.phone ?? null,
    role: raw.role ?? "STUDENT",
    status: (raw.status ?? "ACTIVE") as AdminStudentStatus,
    address: raw.address ?? null,
    createdAt: raw.created_at ?? raw.createdAt ?? null,
  }
}

function mapBatchStudent(rawValue: unknown): AdminBatchStudent {
  const raw = batchStudentSchema.parse(rawValue)
  const enr = raw.enrollment
  return {
    id: String(raw.id ?? ""),
    fullName: raw.full_name ?? raw.fullName ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    enrollmentId: String(raw.enrollment_id ?? raw.enrollmentId ?? enr?.id ?? ""),
    enrollmentStatus: (raw.enrollment_status ??
      raw.enrollmentStatus ??
      enr?.enrollment_status ??
      enr?.enrollmentStatus ??
      "PENDING") as AdminEnrollmentStatus,
    paymentStatus: (raw.payment_status ??
      raw.paymentStatus ??
      enr?.payment_status ??
      enr?.paymentStatus ??
      "UNPAID") as AdminEnrollmentPaymentStatus,
    amountPaid: Number(raw.amount_paid ?? raw.amountPaid ?? enr?.amount_paid ?? enr?.amountPaid ?? 0),
    totalFee: Number(raw.total_fee ?? raw.totalFee ?? enr?.total_fee ?? enr?.totalFee ?? 0),
    progressPercentage: raw.progress_percentage ?? raw.progressPercentage ?? 0,
  }
}

function mapBatchAttendance(rawValue: unknown): AdminBatchAttendance {
  const raw = batchAttendanceSchema.parse(rawValue)
  return {
    id: String(raw.id ?? ""),
    studentId: String(raw.student_id ?? raw.studentId ?? ""),
    studentName:
      raw.student_name ??
      raw.studentName ??
      raw.student?.full_name ??
      raw.student?.fullName ??
      "",
    classDate: raw.class_date ?? raw.classDate ?? "",
    classTopic: raw.class_topic ?? raw.classTopic ?? null,
    status: (raw.status ?? "PRESENT") as AdminAttendanceStatus,
    notes: raw.notes ?? null,
  }
}

function mapAssignment(rawValue: unknown): AdminAssignment {
  const raw = assignmentSchema.parse(rawValue)
  return {
    id: String(raw.id ?? ""),
    courseContentId: String(raw.course_content_id ?? raw.courseContentId ?? ""),
    title: raw.title ?? "",
    description: raw.description ?? "",
    assignmentType: (raw.assignment_type ?? raw.assignmentType ?? "PROJECT") as AdminAssignmentType,
    maxScore: raw.max_score ?? raw.maxScore ?? 100,
    dueDate: raw.due_date ?? raw.dueDate ?? null,
    requiredFiles: raw.required_files ?? raw.requiredFiles ?? [],
    submissionInstructions: raw.submission_instructions ?? raw.submissionInstructions ?? null,
  }
}

function mapSubmission(rawValue: unknown): AdminSubmission {
  const raw = submissionSchema.parse(rawValue)
  return {
    id: String(raw.id ?? ""),
    assignmentId: String(raw.assignment_id ?? raw.assignmentId ?? ""),
    assignmentTitle:
      raw.assignment_title ?? raw.assignmentTitle ?? raw.assignment?.title ?? "",
    studentId: String(raw.student_id ?? raw.studentId ?? ""),
    studentName:
      raw.student_name ??
      raw.studentName ??
      raw.student?.full_name ??
      raw.student?.fullName ??
      "",
    filePaths: raw.file_paths ?? raw.filePaths ?? [],
    githubLink: raw.github_link ?? raw.githubLink ?? null,
    liveDemoLink: raw.live_demo_link ?? raw.liveDemoLink ?? null,
    notes: raw.notes ?? null,
    submittedAt: raw.submitted_at ?? raw.submittedAt ?? null,
    status: (raw.status ?? "SUBMITTED") as AdminSubmissionStatus,
    score: raw.score !== null && raw.score !== undefined ? Number(raw.score) : null,
    feedback: raw.feedback ?? null,
    gradedBy: raw.graded_by ?? raw.gradedBy ?? null,
    gradedAt: raw.graded_at ?? raw.gradedAt ?? null,
  }
}

function buildExpenseRequestBody(payload: AdminCreateExpensePayload) {
  return {
    expense_date: payload.expenseDate,
    category: payload.category,
    amount: payload.amount,
    description: payload.description,
  }
}

function buildFinancialGoalRequestBody(
  payload: AdminCreateFinancialGoalPayload | AdminUpdateFinancialGoalPayload
) {
  return {
    goal_name: payload.goalName,
    target_amount: payload.targetAmount,
    current_amount: payload.currentAmount,
    deadline: payload.deadline,
    status: payload.status,
  }
}

function buildCourseRequestBody(
  payload: AdminCreateCoursePayload | AdminUpdateCoursePayload
) {
  return {
    title: payload.title,
    slug: payload.slug,
    description: payload.description,
    durationMonths: payload.durationMonths,
    price: payload.price,
    difficultyLevel: payload.difficultyLevel,
    skillsCovered: payload.skillsCovered,
    isPublished: payload.isPublished,
    thumbnail: payload.thumbnail,
    installmentPlan: payload.installmentPlan,
  }
}

function buildBatchRequestBody(payload: AdminCreateBatchPayload | AdminUpdateBatchPayload) {
  return {
    courseId: payload.courseId,
    batchName: payload.batchName,
    batchCode: payload.batchCode,
    startDate: payload.startDate,
    endDate: payload.endDate,
    schedule: payload.schedule,
    maxStudents: payload.maxStudents,
    status: payload.status,
    isFree: payload.isFree,
    instructorId: payload.instructorId,
    taIds: payload.taIds,
    meetingLink: payload.meetingLink,
  }
}

function buildCourseContentRequestBody(payload: AdminCreateCourseContentPayload) {
  return {
    courseId: payload.courseId,
    moduleTitle: payload.moduleTitle,
    contentTitle: payload.contentTitle,
    contentType: payload.contentType,
    content: payload.content,
    orderIndex: payload.orderIndex,
    isPreview: payload.isPreview,
  }
}

function buildAnnouncementRequestBody(payload: Partial<AdminAnnouncementPayload>) {
  return {
    title: payload.title,
    content: payload.content,
    target_audience: payload.targetAudience,
    batch_id: payload.batchId,
    course_id: payload.courseId,
    priority: payload.priority,
    is_published: payload.isPublished,
    publish_date: payload.publishDate,
  }
}

function buildRecordPaymentRequestBody(payload: AdminRecordPaymentPayload) {
  return {
    enrollmentId: payload.enrollmentId,
    studentId: payload.studentId,
    amount: payload.amount,
    installmentNumber: payload.installmentNumber,
    paymentMethod: payload.paymentMethod,
    status: payload.status,
    transactionId: payload.transactionId,
    notes: payload.notes,
  }
}

function buildEnrollmentRequestConvertBody(
  payload?: AdminConvertEnrollmentRequestPayload
) {
  return {
    password: payload?.password,
    notes: payload?.notes,
  }
}

async function withLegacyFallback<T>(
  primaryRequest: () => Promise<T>,
  legacyRequest: () => Promise<T>
): Promise<T> {
  try {
    return await primaryRequest()
  } catch (primaryError) {
    try {
      return await legacyRequest()
    } catch {
      throw new Error(getHttpErrorMessage(primaryError))
    }
  }
}

async function fetchMappedList<T>(
  paths: string[],
  mapper: (rawValue: unknown) => T
): Promise<T[]> {
  try {
    const payload = await getWithFallback(paths)
    return mapApiItems(payload, mapper)
  } catch (error) {
    throw new Error(getHttpErrorMessage(error))
  }
}

async function executeMappedMutation<T>(
  request: () => Promise<{ data: unknown }>,
  mapper: (rawValue: unknown) => T
): Promise<T> {
  try {
    const response = await request()
    return mapper(extractApiData(response.data))
  } catch (error) {
    throw new Error(getHttpErrorMessage(error))
  }
}

export const adminApi = {
  async getStudents(): Promise<AdminStudent[]> {
    return fetchMappedList(["/admin/students", "/admin/users"], mapStudent)
  },

  async getPayments(): Promise<AdminPayment[]> {
    return fetchMappedList(["/admin/payments"], mapPayment)
  },

  async getExpenses(): Promise<AdminExpense[]> {
    return fetchMappedList(["/admin/expenses", "/expenses"], mapExpense)
  },

  async createExpense(payload: AdminCreateExpensePayload): Promise<AdminExpense> {
    return executeMappedMutation(
      () =>
        apiClient.post(
        "/admin/expenses",
        buildExpenseRequestBody(payload)
        ),
      mapExpense
    )
  },

  async getFinancialGoals(): Promise<AdminFinancialGoal[]> {
    return fetchMappedList(["/admin/financial-goals", "/financial-goals"], mapFinancialGoal)
  },

  async createFinancialGoal(
    payload: AdminCreateFinancialGoalPayload
  ): Promise<AdminFinancialGoal> {
    return executeMappedMutation(
      () =>
        apiClient.post(
        "/admin/financial-goals",
        buildFinancialGoalRequestBody(payload)
        ),
      mapFinancialGoal
    )
  },

  async updateFinancialGoal(
    goalId: string,
    payload: AdminUpdateFinancialGoalPayload
  ): Promise<AdminFinancialGoal> {
    return executeMappedMutation(
      () =>
        apiClient.put(
        `/admin/financial-goals/${goalId}`,
        buildFinancialGoalRequestBody(payload)
        ),
      mapFinancialGoal
    )
  },

  async getEnrollments(): Promise<AdminEnrollment[]> {
    return fetchMappedList(
      ["/admin/enrollments", "/enrollments", "/students/me/enrollments"],
      mapEnrollment
    )
  },

  async createEnrollment(payload: AdminCreateEnrollmentPayload): Promise<AdminEnrollment> {
    return executeMappedMutation(
      () =>
        apiClient.post("/admin/enrollments", {
          studentId: payload.studentId,
          batchId: payload.batchId,
          courseId: payload.courseId,
          totalFee: payload.totalFee,
          paymentStatus: payload.paymentStatus,
          enrollmentStatus: payload.enrollmentStatus,
          accessType: payload.accessType,
        }),
      mapEnrollment
    )
  },

  async getCourses(): Promise<Course[]> {
    return fetchMappedList(["/admin/courses", "/courses"], mapCourse)
  },

  async createCourse(payload: AdminCreateCoursePayload): Promise<Course> {
    return executeMappedMutation(
      () =>
        apiClient.post(
        "/admin/courses",
        buildCourseRequestBody(payload)
        ),
      mapCourse
    )
  },

  async updateCourse(
    courseId: string,
    payload: AdminUpdateCoursePayload
  ): Promise<Course> {
    return executeMappedMutation(
      () =>
        apiClient.put(
        `/admin/courses/${courseId}`,
        buildCourseRequestBody(payload)
        ),
      mapCourse
    )
  },

  async createCourseContent(
    payload: AdminCreateCourseContentPayload
  ): Promise<unknown> {
    try {
      return await postWithFallback(["/admin/courses/content"], buildCourseContentRequestBody(payload))
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async getOverview(): Promise<AdminOverview> {
    try {
      const payload = await getWithFallback(["/admin/analytics/dashboard", "/admin/financials"])
      const source = payload as Record<string, unknown>

      return {
        totalStudents: Number(source.totalStudents ?? source.total_students ?? 0),
        activeStudents: Number(source.activeStudents ?? source.active_students ?? 0),
        totalRevenue: Number(source.totalRevenue ?? source.total_revenue ?? 0),
        pendingPayments: Number(source.pendingPayments ?? source.pending_payments ?? 0),
      }
    } catch {
      const [students, payments] = await Promise.all([
        adminApi.getStudents(),
        adminApi.getPayments(),
      ])

      const totalRevenue = payments
        .filter((payment) => payment.status === "CONFIRMED")
        .reduce((sum, payment) => sum + payment.amount, 0)

      return {
        totalStudents: students.length,
        activeStudents: students.filter((student) => student.status === "ACTIVE").length,
        totalRevenue,
        pendingPayments: payments.filter((payment) => payment.status === "PENDING").length,
      }
    }
  },

  async getBatches(): Promise<AdminBatch[]> {
    return fetchMappedList(["/admin/batches", "/batches"], mapBatch)
  },

  async createBatch(payload: AdminCreateBatchPayload): Promise<AdminBatch> {
    return executeMappedMutation(
      () =>
        apiClient.post(
        "/admin/batches",
        buildBatchRequestBody(payload)
        ),
      mapBatch
    )
  },

  async updateBatch(
    batchId: string,
    payload: AdminUpdateBatchPayload
  ): Promise<AdminBatch> {
    return executeMappedMutation(
      () =>
        apiClient.put(
        `/admin/batches/${batchId}`,
        buildBatchRequestBody(payload)
        ),
      mapBatch
    )
  },

  async getEnrollmentRequests(): Promise<AdminEnrollmentRequest[]> {
    return fetchMappedList(["/admin/enrollment-forms"], mapEnrollmentRequest)
  },

  async updateEnrollmentRequestStatus(
    requestId: string,
    status: EnrollmentRequestStatus,
    notes?: string
  ): Promise<AdminEnrollmentRequest> {
    try {
      const payload = await putWithFallback(
        [
          `/admin/enrollment-forms/${requestId}`,
          `/admin/enrollment-forms/${requestId}/status`,
        ],
        {
          status,
          notes,
        }
      )

      try {
        return mapEnrollmentRequest(payload)
      } catch {
        const all = await adminApi.getEnrollmentRequests()
        const found = all.find((request) => request.id === requestId)
        if (!found) {
          throw new Error("Enrollment request was updated but could not be reloaded.")
        }
        return found
      }
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async convertEnrollmentRequest(
    requestId: string,
    payload?: AdminConvertEnrollmentRequestPayload
  ): Promise<AdminEnrollmentRequest> {
    try {
      const responsePayload = await postWithFallback(
        [
          `/admin/enrollment-forms/${requestId}/convert`,
          `/admin/enrollment-forms/${requestId}/convert-to-student`,
          `/admin/enrollment-forms/${requestId}/enroll`,
        ],
        buildEnrollmentRequestConvertBody(payload)
      )

      if (
        responsePayload &&
        typeof responsePayload === "object" &&
        "enrollmentForm" in responsePayload
      ) {
        return mapEnrollmentRequest(
          (responsePayload as { enrollmentForm?: unknown }).enrollmentForm
        )
      }

      return mapEnrollmentRequest(responsePayload)
    } catch {
      return adminApi.updateEnrollmentRequestStatus(
        requestId,
        "ENROLLED",
        payload?.notes
      )
    }
  },

  async getCertificates(): Promise<AdminCertificate[]> {
    return fetchMappedList(["/admin/certificates"], mapCertificate)
  },

  async generateCertificate(
    payload: AdminGenerateCertificatePayload
  ): Promise<AdminCertificate> {
    return executeMappedMutation(
      () =>
        apiClient.post("/admin/certificates/generate", {
          enrollmentId: payload.enrollmentId,
          signatureName: payload.signatureName,
          signatureTitle: payload.signatureTitle,
        }),
      mapCertificate
    )
  },

  async recordPayment(payload: AdminRecordPaymentPayload): Promise<AdminPayment> {
    return executeMappedMutation(
      () =>
        apiClient.post(
        "/admin/payments",
        buildRecordPaymentRequestBody(payload)
        ),
      mapPayment
    )
  },

  async getAnnouncements(): Promise<AdminAnnouncement[]> {
    return fetchMappedList(["/admin/announcements", "/announcements"], mapAnnouncement)
  },

  async createAnnouncement(payload: AdminAnnouncementPayload): Promise<AdminAnnouncement> {
    const requestBody = buildAnnouncementRequestBody(payload)

    return withLegacyFallback(
      () => executeMappedMutation(() => apiClient.post("/admin/announcements", requestBody), mapAnnouncement),
      () => executeMappedMutation(() => apiClient.post("/announcements", requestBody), mapAnnouncement)
    )
  },

  async updateAnnouncement(
    announcementId: string,
    payload: Partial<AdminAnnouncementPayload>
  ): Promise<AdminAnnouncement> {
    const requestBody = buildAnnouncementRequestBody(payload)

    return withLegacyFallback(
      () =>
        executeMappedMutation(
          () => apiClient.put(`/admin/announcements/${announcementId}`, requestBody),
          mapAnnouncement
        ),
      () =>
        executeMappedMutation(
          () => apiClient.put(`/announcements/${announcementId}`, requestBody),
          mapAnnouncement
        )
    )
  },

  async setAnnouncementPublished(
    announcementId: string,
    isPublished: boolean
  ): Promise<AdminAnnouncement> {
    return withLegacyFallback(
      () => adminApi.updateAnnouncement(announcementId, { isPublished }),
      async () => {
        const responsePayload = await postWithFallback(
          [
            `/admin/announcements/${announcementId}/publish`,
            `/admin/announcements/${announcementId}/status`,
          ],
          {
            is_published: isPublished,
            isPublished,
          }
        )
        return mapAnnouncement(responsePayload)
      }
    )
  },

  async getTestimonials(): Promise<AdminTestimonial[]> {
    return fetchMappedList(["/admin/testimonials", "/testimonials"], mapTestimonial)
  },

  async setTestimonialApproved(
    testimonialId: string,
    isApproved: boolean
  ): Promise<AdminTestimonial> {
    return withLegacyFallback(
      () =>
        executeMappedMutation(
          () =>
            apiClient.put(`/admin/testimonials/${testimonialId}`, {
              is_approved: isApproved,
            }),
          mapTestimonial
        ),
      async () => {
        const responsePayload = await postWithFallback(
          [
            `/admin/testimonials/${testimonialId}/approve`,
            `/admin/testimonials/${testimonialId}/status`,
          ],
          {
            is_approved: isApproved,
            isApproved,
          }
        )
        return mapTestimonial(responsePayload)
      }
    )
  },

  async setTestimonialFeatured(
    testimonialId: string,
    isFeatured: boolean
  ): Promise<AdminTestimonial> {
    return withLegacyFallback(
      () =>
        executeMappedMutation(
          () =>
            apiClient.put(`/admin/testimonials/${testimonialId}`, {
              is_featured: isFeatured,
            }),
          mapTestimonial
        ),
      async () => {
        const responsePayload = await postWithFallback(
          [
            `/admin/testimonials/${testimonialId}/feature`,
            `/admin/testimonials/${testimonialId}/status`,
          ],
          {
            is_featured: isFeatured,
            isFeatured,
          }
        )
        return mapTestimonial(responsePayload)
      }
    )
  },

  // --- Users ---

  async getAllUsers(): Promise<AdminUser[]> {
    return fetchMappedList(["/admin/users"], mapUser)
  },

  async getUserById(userId: string): Promise<AdminUser> {
    try {
      const data = await getWithFallback([`/admin/users/${userId}`])
      return mapUser(data)
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async updateUserRole(userId: string, payload: UpdateUserRolePayload): Promise<AdminUser> {
    return executeMappedMutation(
      () => apiClient.put(`/admin/users/${userId}/role`, payload),
      mapUser
    )
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      await deleteWithFallback([`/admin/users/${userId}`])
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  // --- Courses ---

  async deleteCourse(courseId: string): Promise<void> {
    try {
      await deleteWithFallback([`/admin/courses/${courseId}`])
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  // --- Batches (detail) ---

  async getBatchStudents(batchId: string): Promise<AdminBatchStudent[]> {
    return fetchMappedList(
      [`/admin/batches/${batchId}/students`, `/ta/batches/${batchId}/students`],
      mapBatchStudent
    )
  },

  async assignTa(batchId: string, payload: AssignTaPayload): Promise<AdminBatch> {
    return executeMappedMutation(
      () => apiClient.post(`/admin/batches/${batchId}/assign-ta`, payload),
      mapBatch
    )
  },

  async getBatchAttendance(batchId: string): Promise<AdminBatchAttendance[]> {
    return fetchMappedList([`/admin/batches/${batchId}/attendance`], mapBatchAttendance)
  },

  // --- Enrollments ---

  async updateEnrollmentStatus(
    enrollmentId: string,
    payload: UpdateEnrollmentStatusPayload
  ): Promise<AdminEnrollment> {
    return executeMappedMutation(
      () => apiClient.put(`/admin/enrollments/${enrollmentId}/status`, payload),
      mapEnrollment
    )
  },

  // --- Assignments ---

  async createAssignment(payload: AdminCreateAssignmentPayload): Promise<AdminAssignment> {
    return executeMappedMutation(
      () =>
        apiClient.post("/admin/assignments", {
          courseContentId: payload.courseContentId,
          title: payload.title,
          assignmentType: payload.assignmentType,
          description: payload.description,
          maxScore: payload.maxScore,
          dueDate: payload.dueDate,
          requiredFiles: payload.requiredFiles,
          submissionInstructions: payload.submissionInstructions,
        }),
      mapAssignment
    )
  },

  // --- Payments (extended) ---

  async getPendingPayments(): Promise<AdminPayment[]> {
    return fetchMappedList(["/admin/payments/pending"], mapPayment)
  },

  async sendPaymentReminder(paymentId: string): Promise<void> {
    try {
      await postWithFallback([`/admin/payments/${paymentId}/reminder`], {})
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  // --- Analytics ---

  async getRevenueAnalytics(): Promise<AdminAnalyticsRevenue> {
    try {
      const data = await getWithFallback(["/admin/analytics/revenue"])
      const source = data as Record<string, unknown>

      const revenueByPeriod = (
        (source.revenueByPeriod ?? source.revenue_by_period ?? []) as unknown[]
      ).map((item) => {
        const entry = item as Record<string, unknown>
        return {
          period: String(entry.period ?? ""),
          revenue: Number(entry.revenue ?? 0),
          payments: Number(entry.payments ?? 0),
        } satisfies AdminRevenueDataPoint
      })

      const revenueByPaymentMethod = (source.revenueByPaymentMethod ??
        source.revenue_by_payment_method ??
        {}) as Record<string, number>

      return {
        totalRevenue: Number(source.totalRevenue ?? source.total_revenue ?? 0),
        revenueByPeriod,
        revenueByPaymentMethod,
      }
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async getStudentAnalytics(): Promise<AdminAnalyticsStudents> {
    try {
      const data = await getWithFallback(["/admin/analytics/students"])
      const source = data as Record<string, unknown>

      const studentsByPeriod = (
        (source.studentsByPeriod ?? source.students_by_period ?? []) as unknown[]
      ).map((item) => {
        const entry = item as Record<string, unknown>
        return {
          period: String(entry.period ?? ""),
          newStudents: Number(entry.newStudents ?? entry.new_students ?? 0),
          activeStudents: Number(entry.activeStudents ?? entry.active_students ?? 0),
        } satisfies AdminStudentDataPoint
      })

      return {
        totalStudents: Number(source.totalStudents ?? source.total_students ?? 0),
        activeStudents: Number(source.activeStudents ?? source.active_students ?? 0),
        inactiveStudents: Number(source.inactiveStudents ?? source.inactive_students ?? 0),
        studentsByPeriod,
      }
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  async getCourseAnalytics(): Promise<AdminAnalyticsCourses> {
    try {
      const data = await getWithFallback(["/admin/analytics/courses"])
      const source = data as Record<string, unknown>

      const courses = (
        (source.courses ?? []) as unknown[]
      ).map((item) => {
        const entry = item as Record<string, unknown>
        return {
          courseId: String(entry.courseId ?? entry.course_id ?? ""),
          courseTitle: String(entry.courseTitle ?? entry.course_title ?? ""),
          enrollments: Number(entry.enrollments ?? 0),
          revenue: Number(entry.revenue ?? 0),
          completionRate: Number(entry.completionRate ?? entry.completion_rate ?? 0),
        } satisfies AdminCourseAnalyticsItem
      })

      return {
        totalCourses: Number(source.totalCourses ?? source.total_courses ?? courses.length),
        courses,
      }
    } catch (error) {
      throw new Error(getHttpErrorMessage(error))
    }
  },

  // --- Submissions (admin grading) ---

  async gradeSubmission(
    submissionId: string,
    payload: AdminGradeSubmissionPayload
  ): Promise<AdminSubmission> {
    return executeMappedMutation(
      () => apiClient.post(`/admin/submissions/${submissionId}/grade`, payload),
      mapSubmission
    )
  },

  async getFinancialSummary(): Promise<AdminFinancialSummary> {
    try {
      const payload = await getWithFallback(["/admin/financials"])
      const source = payload as Record<string, unknown>

      return {
        totalRevenue: Number(source.totalRevenue ?? source.total_revenue ?? 0),
        totalPayments: Number(source.totalPayments ?? source.total_payments ?? 0),
        outstandingAmount: Number(source.outstandingAmount ?? source.outstanding_amount ?? 0),
      }
    } catch {
      const payments = await adminApi.getPayments()
      const totalRevenue = payments
        .filter((payment) => payment.status === "CONFIRMED")
        .reduce((sum, payment) => sum + payment.amount, 0)
      const totalPayments = payments.length
      const outstandingAmount = payments
        .filter((payment) => payment.status === "PENDING")
        .reduce((sum, payment) => sum + payment.amount, 0)

      return {
        totalRevenue,
        totalPayments,
        outstandingAmount,
      }
    }
  },
}
