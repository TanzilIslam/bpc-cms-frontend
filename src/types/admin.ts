export type AdminStudentStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED"

export type AdminStudent = {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  status: AdminStudentStatus
  createdAt: string | null
}

export type AdminPaymentStatus = "PENDING" | "CONFIRMED" | "FAILED" | "REFUNDED"

export type AdminPayment = {
  id: string
  studentName: string
  amount: number
  paymentMethod: string
  status: AdminPaymentStatus
  paymentDate: string | null
}

export type AdminPaymentMethod = "CASH" | "BKASH" | "NAGAD" | "BANK_TRANSFER"

export type AdminRecordPaymentPayload = {
  enrollmentId: string
  studentId: string
  amount: number
  installmentNumber: number
  paymentMethod: AdminPaymentMethod
  status: AdminPaymentStatus
  transactionId?: string
  notes?: string
}

export type AdminOverview = {
  totalStudents: number
  activeStudents: number
  totalRevenue: number
  pendingPayments: number
}

export type AdminEnrollmentStatus =
  | "PENDING"
  | "ACTIVE"
  | "COMPLETED"
  | "DROPPED"
  | "SUSPENDED"

export type AdminEnrollmentPaymentStatus = "UNPAID" | "PARTIAL" | "FULL"

export type AdminEnrollment = {
  id: string
  studentId: string
  studentName: string
  courseTitle: string
  batchName: string
  enrollmentStatus: AdminEnrollmentStatus
  paymentStatus: AdminEnrollmentPaymentStatus
  amountPaid: number
  totalFee: number
}

export type AdminBatchStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"

export type AdminBatch = {
  id: string
  courseId: string
  batchName: string
  batchCode: string
  courseTitle: string
  schedule: string
  status: AdminBatchStatus
  maxStudents: number
  currentEnrollment: number
}

export type AdminCreateBatchPayload = {
  courseId: string
  batchName: string
  batchCode: string
  startDate: string
  endDate: string
  schedule: string
  maxStudents: number
  status: AdminBatchStatus
  isFree: boolean
}

export type AdminUpdateBatchPayload = Partial<AdminCreateBatchPayload>

export type EnrollmentRequestStatus =
  | "PENDING"
  | "CONTACTED"
  | "ENROLLED"
  | "REJECTED"

export type AdminEnrollmentRequest = {
  id: string
  fullName: string
  email: string
  phone: string
  interestedCourse: string
  hasLaptop: boolean
  laptopSpecs: string | null
  hasInternet: boolean
  whyJoin: string | null
  notes: string | null
  status: EnrollmentRequestStatus
  createdAt: string | null
  updatedAt: string | null
}

export type AdminCertificate = {
  id: string
  enrollmentId: string
  certificateCode: string
  studentName: string
  courseTitle: string
  grade: string
  issueDate: string | null
  isVerified: boolean
}

export type AdminGenerateCertificatePayload = {
  enrollmentId: string
}

export type AdminFinancialSummary = {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  pendingPayments: number
}

export type AdminExpenseCategory =
  | "INTERNET"
  | "ELECTRICITY"
  | "EQUIPMENT"
  | "MARKETING"
  | "TA_PAYMENT"
  | "OTHER"

export type AdminExpense = {
  id: string
  expenseDate: string | null
  category: AdminExpenseCategory
  amount: number
  description: string
}

export type AdminCreateExpensePayload = {
  expenseDate: string
  category: AdminExpenseCategory
  amount: number
  description: string
}

export type AdminFinancialGoalStatus = "ACTIVE" | "ACHIEVED" | "CANCELLED"

export type AdminFinancialGoal = {
  id: string
  goalName: string
  targetAmount: number
  currentAmount: number
  deadline: string | null
  status: AdminFinancialGoalStatus
}

export type AdminCreateFinancialGoalPayload = {
  goalName: string
  targetAmount: number
  currentAmount: number
  deadline?: string
  status?: AdminFinancialGoalStatus
}

export type AdminUpdateFinancialGoalPayload = Partial<AdminCreateFinancialGoalPayload>

export type AdminCourseDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"

export type AdminCreateCoursePayload = {
  title: string
  description: string
  durationMonths: number
  price: number
  difficultyLevel: AdminCourseDifficulty
  skillsCovered: string[]
  isPublished: boolean
}

export type AdminUpdateCoursePayload = Partial<AdminCreateCoursePayload>

export type AdminCreateCourseContentPayload = {
  courseId: string
  moduleTitle: string
  contentTitle: string
  contentType: "VIDEO" | "PDF" | "TEXT" | "LINK"
  content: string
  orderIndex: number
  isPreview: boolean
}


export type AdminAnnouncementPriority = "LOW" | "MEDIUM" | "HIGH"
export type AdminAnnouncementAudience = "ALL" | "BATCH_SPECIFIC" | "COURSE_SPECIFIC"

export type AdminAnnouncement = {
  id: string
  title: string
  content: string
  targetAudience: AdminAnnouncementAudience
  batchId: string | null
  courseId: string | null
  priority: AdminAnnouncementPriority
  isPublished: boolean
  publishDate: string | null
  createdAt: string | null
}

export type AdminAnnouncementPayload = {
  title: string
  content: string
  targetAudience: AdminAnnouncementAudience
  batchId?: string
  courseId?: string
  priority: AdminAnnouncementPriority
  isPublished: boolean
  publishDate?: string
}

export type AdminConvertEnrollmentRequestPayload = {
  password?: string
  notes?: string
}

export type AdminTestimonial = {
  id: string
  studentName: string
  courseTitle: string
  rating: number
  review: string
  isApproved: boolean
  isFeatured: boolean
  createdAt: string | null
}
