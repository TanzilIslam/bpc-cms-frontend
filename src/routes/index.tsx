import { type ReactNode, Suspense, lazy } from "react"
import { createBrowserRouter } from "react-router-dom"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { UnauthorizedPage } from "@/pages/UnauthorizedPage"
import { ProtectedRoute } from "@/routes/ProtectedRoute"
import { RoleRoute } from "@/routes/RoleRoute"

const HomePage = lazy(() =>
  import("@/pages/public/HomePage").then((module) => ({ default: module.HomePage }))
)
const CoursesPage = lazy(() =>
  import("@/pages/public/CoursesPage").then((module) => ({ default: module.CoursesPage }))
)
const CourseDetailPage = lazy(() =>
  import("@/pages/public/CourseDetailPage").then((module) => ({
    default: module.CourseDetailPage,
  }))
)
const EnrollmentFormPage = lazy(() =>
  import("@/pages/public/EnrollmentFormPage").then((module) => ({
    default: module.EnrollmentFormPage,
  }))
)
const AboutPage = lazy(() =>
  import("@/pages/public/AboutPage").then((module) => ({ default: module.AboutPage }))
)
const ProjectShowcasePage = lazy(() =>
  import("@/pages/public/ProjectShowcasePage").then((module) => ({
    default: module.ProjectShowcasePage,
  }))
)
const CertificateVerificationPage = lazy(() =>
  import("@/pages/public/CertificateVerificationPage").then((module) => ({
    default: module.CertificateVerificationPage,
  }))
)

const LoginPage = lazy(() =>
  import("@/pages/auth/LoginPage").then((module) => ({ default: module.LoginPage }))
)
const RegisterPage = lazy(() =>
  import("@/pages/auth/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  }))
)
const ForgotPasswordPage = lazy(() =>
  import("@/pages/auth/ForgotPasswordPage").then((module) => ({
    default: module.ForgotPasswordPage,
  }))
)
const ResetPasswordPage = lazy(() =>
  import("@/pages/auth/ResetPasswordPage").then((module) => ({
    default: module.ResetPasswordPage,
  }))
)

const StudentDashboardPage = lazy(() =>
  import("@/pages/student/DashboardPage").then((module) => ({
    default: module.StudentDashboardPage,
  }))
)
const MyCoursesPage = lazy(() =>
  import("@/pages/student/MyCoursesPage").then((module) => ({
    default: module.MyCoursesPage,
  }))
)
const CourseViewPage = lazy(() =>
  import("@/pages/student/CourseViewPage").then((module) => ({
    default: module.CourseViewPage,
  }))
)
const AssignmentsPage = lazy(() =>
  import("@/pages/student/AssignmentsPage").then((module) => ({
    default: module.AssignmentsPage,
  }))
)
const MyProgressPage = lazy(() =>
  import("@/pages/student/MyProgressPage").then((module) => ({
    default: module.MyProgressPage,
  }))
)
const MyProjectsPage = lazy(() =>
  import("@/pages/student/MyProjectsPage").then((module) => ({
    default: module.MyProjectsPage,
  }))
)
const MyCertificatePage = lazy(() =>
  import("@/pages/student/MyCertificatePage").then((module) => ({
    default: module.MyCertificatePage,
  }))
)
const StudentPaymentsPage = lazy(() =>
  import("@/pages/student/PaymentsPage").then((module) => ({
    default: module.StudentPaymentsPage,
  }))
)

const TADashboardPage = lazy(() =>
  import("@/pages/ta/DashboardPage").then((module) => ({ default: module.TADashboardPage }))
)
const TAMyBatchesPage = lazy(() =>
  import("@/pages/ta/MyBatchesPage").then((module) => ({
    default: module.TAMyBatchesPage,
  }))
)
const TAAttendancePage = lazy(() =>
  import("@/pages/ta/AttendancePage").then((module) => ({
    default: module.TAAttendancePage,
  }))
)
const TAGradingPage = lazy(() =>
  import("@/pages/ta/GradingPage").then((module) => ({ default: module.TAGradingPage }))
)
const TAStudentProgressPage = lazy(() =>
  import("@/pages/ta/StudentProgressPage").then((module) => ({
    default: module.TAStudentProgressPage,
  }))
)

const AdminDashboardPage = lazy(() =>
  import("@/pages/admin/DashboardPage").then((module) => ({
    default: module.AdminDashboardPage,
  }))
)
const AdminStudentsPage = lazy(() =>
  import("@/pages/admin/StudentsPage").then((module) => ({
    default: module.AdminStudentsPage,
  }))
)
const AdminCoursesPage = lazy(() =>
  import("@/pages/admin/CoursesPage").then((module) => ({
    default: module.AdminCoursesPage,
  }))
)
const AdminBatchesPage = lazy(() =>
  import("@/pages/admin/BatchesPage").then((module) => ({
    default: module.AdminBatchesPage,
  }))
)
const AdminEnrollmentRequestsPage = lazy(() =>
  import("@/pages/admin/EnrollmentRequestsPage").then((module) => ({
    default: module.AdminEnrollmentRequestsPage,
  }))
)
const AdminCertificatesPage = lazy(() =>
  import("@/pages/admin/CertificatesPage").then((module) => ({
    default: module.AdminCertificatesPage,
  }))
)
const AdminFinancialsPage = lazy(() =>
  import("@/pages/admin/FinancialsPage").then((module) => ({
    default: module.AdminFinancialsPage,
  }))
)
const AdminAnalyticsPage = lazy(() =>
  import("@/pages/admin/AnalyticsPage").then((module) => ({
    default: module.AdminAnalyticsPage,
  }))
)
const AdminPaymentsPage = lazy(() =>
  import("@/pages/admin/PaymentsPage").then((module) => ({
    default: module.AdminPaymentsPage,
  }))
)
const AdminAnnouncementsPage = lazy(() =>
  import("@/pages/admin/AnnouncementsPage").then((module) => ({
    default: module.AdminAnnouncementsPage,
  }))
)
const AdminTestimonialsPage = lazy(() =>
  import("@/pages/admin/TestimonialsPage").then((module) => ({
    default: module.AdminTestimonialsPage,
  }))
)

function withSuspense(node: ReactNode): ReactNode {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[30vh] items-center justify-center text-sm text-muted-foreground">
          Loading page...
        </div>
      }
    >
      {node}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: "courses", element: withSuspense(<CoursesPage />) },
      { path: "courses/:slug", element: withSuspense(<CourseDetailPage />) },
      { path: "projects", element: withSuspense(<ProjectShowcasePage />) },
      { path: "enroll", element: withSuspense(<EnrollmentFormPage />) },
      {
        path: "verify-certificate",
        element: withSuspense(<CertificateVerificationPage />),
      },
      {
        path: "verify-certificate/:code",
        element: withSuspense(<CertificateVerificationPage />),
      },
      { path: "about", element: withSuspense(<AboutPage />) },
    ],
  },
  {
    path: "/auth",
    element: <PublicLayout />,
    children: [
      { index: true, element: withSuspense(<LoginPage />) },
      { path: "login", element: withSuspense(<LoginPage />) },
      { path: "register", element: withSuspense(<RegisterPage />) },
      { path: "forgot-password", element: withSuspense(<ForgotPasswordPage />) },
      { path: "reset-password/:token", element: withSuspense(<ResetPasswordPage />) },
    ],
  },
  {
    path: "/student",
    element: (
      <ProtectedRoute>
        <RoleRoute
          allowedRoles={["STUDENT", "ALUMNI", "TA", "ADMIN", "SUPER_ADMIN"]}
        >
          <DashboardLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(<StudentDashboardPage />) },
      { path: "courses", element: withSuspense(<MyCoursesPage />) },
      { path: "courses/:id", element: withSuspense(<CourseViewPage />) },
      { path: "assignments", element: withSuspense(<AssignmentsPage />) },
      { path: "progress", element: withSuspense(<MyProgressPage />) },
      { path: "projects", element: withSuspense(<MyProjectsPage />) },
      { path: "certificate", element: withSuspense(<MyCertificatePage />) },
      { path: "payments", element: withSuspense(<StudentPaymentsPage />) },
    ],
  },
  {
    path: "/ta",
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={["TA", "ADMIN", "SUPER_ADMIN"]}>
          <DashboardLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(<TADashboardPage />) },
      { path: "batches", element: withSuspense(<TAMyBatchesPage />) },
      { path: "attendance", element: withSuspense(<TAAttendancePage />) },
      { path: "progress", element: withSuspense(<TAStudentProgressPage />) },
      { path: "grading", element: withSuspense(<TAGradingPage />) },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
          <DashboardLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(<AdminDashboardPage />) },
      { path: "students", element: withSuspense(<AdminStudentsPage />) },
      { path: "courses", element: withSuspense(<AdminCoursesPage />) },
      { path: "batches", element: withSuspense(<AdminBatchesPage />) },
      { path: "payments", element: withSuspense(<AdminPaymentsPage />) },
      { path: "announcements", element: withSuspense(<AdminAnnouncementsPage />) },
      { path: "testimonials", element: withSuspense(<AdminTestimonialsPage />) },
      {
        path: "enrollment-requests",
        element: withSuspense(<AdminEnrollmentRequestsPage />),
      },
      { path: "certificates", element: withSuspense(<AdminCertificatesPage />) },
      { path: "financials", element: withSuspense(<AdminFinancialsPage />) },
      { path: "analytics", element: withSuspense(<AdminAnalyticsPage />) },
    ],
  },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "*", element: <NotFoundPage /> },
])
