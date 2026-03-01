import { z } from "zod"

import { apiClient } from "@/api/client"
import { extractApiData, getHttpErrorMessage, mapApiItems } from "@/api/http"
import { getWithFallback, postWithFallback, putWithFallback } from "@/api/request"
import type { Course } from "@/types/course"
import type {
  AdminAnnouncement,
  AdminAnnouncementAudience,
  AdminAnnouncementPayload,
  AdminAnnouncementPriority,
  AdminBatch,
  AdminBatchStatus,
  AdminCertificate,
  AdminConvertEnrollmentRequestPayload,
  AdminCreateBatchPayload,
  AdminCreateCoursePayload,
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
  AdminOverview,
  AdminPayment,
  AdminRecordPaymentPayload,
  AdminPaymentStatus,
  AdminStudent,
  AdminStudentStatus,
  AdminTestimonial,
  AdminUpdateBatchPayload,
  AdminUpdateCoursePayload,
  AdminUpdateFinancialGoalPayload,
  EnrollmentRequestStatus,
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
    description: payload.description,
    duration_months: payload.durationMonths,
    price: payload.price,
    difficulty_level: payload.difficultyLevel,
    skills_covered: payload.skillsCovered,
    is_published: payload.isPublished,
  }
}

function buildBatchRequestBody(payload: AdminCreateBatchPayload | AdminUpdateBatchPayload) {
  return {
    course_id: payload.courseId,
    batch_name: payload.batchName,
    batch_code: payload.batchCode,
    start_date: payload.startDate,
    end_date: payload.endDate,
    schedule: payload.schedule,
    max_students: payload.maxStudents,
    status: payload.status,
    is_free: payload.isFree,
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
    enrollment_id: payload.enrollmentId,
    student_id: payload.studentId,
    amount: payload.amount,
    installment_number: payload.installmentNumber,
    payment_method: payload.paymentMethod,
    status: payload.status,
    transaction_id: payload.transactionId,
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
    return fetchMappedList(["/admin/users", "/admin/students"], mapStudent)
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
          enrollment_id: payload.enrollmentId,
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

  async getFinancialSummary(): Promise<AdminFinancialSummary> {
    try {
      const payload = await getWithFallback(["/admin/financials"])
      const source = payload as Record<string, unknown>

      const totalRevenue = Number(source.totalRevenue ?? source.total_revenue ?? 0)
      const totalExpenses = Number(source.totalExpenses ?? source.total_expenses ?? 0)
      const pendingPayments = Number(source.pendingPayments ?? source.pending_payments ?? 0)

      return {
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        pendingPayments,
      }
    } catch {
      const [payments, expenses] = await Promise.all([
        adminApi.getPayments(),
        adminApi.getExpenses().catch(() => []),
      ])
      const totalRevenue = payments
        .filter((payment) => payment.status === "CONFIRMED")
        .reduce((sum, payment) => sum + payment.amount, 0)
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
      const pendingPayments = payments.filter((payment) => payment.status === "PENDING").length

      return {
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        pendingPayments,
      }
    }
  },
}
