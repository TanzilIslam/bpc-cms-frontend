# API Integration Checklist (Frontend ↔ Backend)

## Status legend
- [x] Integrated
- [ ] Not started
- [~] In progress
- [!] Blocked

---

## Public APIs (13)

| # | Module | Method | Endpoint | Frontend API file | Hook / Page |
|---|--------|--------|----------|-------------------|-------------|
| 1 | Auth | POST | `/api/v1/auth/register` | `auth.api.ts` | `RegisterPage` |
| 2 | Auth | POST | `/api/v1/auth/login` | `auth.api.ts` | `LoginPage` |
| 3 | Auth | POST | `/api/v1/auth/logout` | `auth.api.ts` | `useAuth` |
| 4 | Auth | POST | `/api/v1/auth/refresh-token` | `auth.api.ts` | `api/client.ts` (interceptor) |
| 5 | Auth | POST | `/api/v1/auth/forgot-password` | `auth.api.ts` | `ForgotPasswordPage` |
| 6 | Auth | POST | `/api/v1/auth/reset-password` | `auth.api.ts` | `ResetPasswordPage` |
| 7 | Courses | GET | `/api/v1/courses` | `courses.api.ts` | `useCourses` |
| 8 | Courses | GET | `/api/v1/courses/:slug` | `courses.api.ts` | `CourseDetailPage` |
| 9 | Courses | GET | `/api/v1/courses/:id/content` | `courses.api.ts` | — |
| 10 | Batches | GET | `/api/v1/batches` | `batches.api.ts` | — |
| 11 | Projects | GET | `/api/v1/projects` | `projects.api.ts` | `useProjects` |
| 12 | Enrollment Forms | POST | `/api/v1/enrollment-forms` | `enrollment-forms.api.ts` | `EnrollmentFormPage` |
| 13 | Certificates | GET | `/api/v1/certificates/verify/:code` | `certificates.api.ts` | `useCertificateVerification` |

**Status: [x] 13 / 13**

---

## Users (3)

| # | Method | Endpoint | Auth | Frontend API file | Hook / Page |
|---|--------|----------|------|-------------------|-------------|
| 14 | GET | `/api/v1/users/me` | Any | `users.api.ts` | — |
| 15 | PUT | `/api/v1/users/me` | Any | `users.api.ts` | — |
| 16 | POST | `/api/v1/users/me/avatar` | Any | `users.api.ts` | — |

**Status: [x] 3 / 3**

---

## Students (9)

| # | Method | Endpoint | Frontend API file | Hook / Page |
|---|--------|----------|-------------------|-------------|
| 17 | GET | `/api/v1/students/me` | `students.api.ts` | `DashboardPage` |
| 18 | GET | `/api/v1/students/me/enrollments` | `enrollments.api.ts` | `useEnrollments` |
| 19 | GET | `/api/v1/students/me/enrollments/:id/progress` | `enrollments.api.ts` | — |
| 20 | GET | `/api/v1/students/me/assignments` | `assignments.api.ts` | `useAssignments` |
| 21 | POST | `/api/v1/students/me/assignments/:id/submit` | `assignments.api.ts` | `AssignmentsPage` |
| 22 | GET | `/api/v1/students/me/progress` | `enrollments.api.ts` | `MyProgressPage` |
| 23 | GET | `/api/v1/students/me/certificate` | `certificates.api.ts` | `useMyCertificate` |
| 24 | GET | `/api/v1/students/me/payments` | `payments.api.ts` | — |
| 25 | GET | `/api/v1/students/me/attendance` | `students.api.ts` | — |

**Status: [x] 9 / 9**

---

## Enrollments (1)

| # | Method | Endpoint | Auth | Frontend API file | Hook / Page |
|---|--------|----------|------|-------------------|-------------|
| 26 | POST | `/api/v1/enrollments` | `STUDENT` | `enrollments.api.ts` | — |

**Status: [x] 1 / 1**

---

## Assignments & Submissions (2)

| # | Method | Endpoint | Frontend API file | Hook / Page |
|---|--------|----------|-------------------|-------------|
| 27 | GET | `/api/v1/assignments/:id` | `assignments.api.ts` | — |
| 28 | GET | `/api/v1/submissions/:id` | `submissions.api.ts` | — |

**Status: [x] 2 / 2**

---

## TA (3)

| # | Method | Endpoint | Frontend API file | Hook / Page |
|---|--------|----------|-------------------|-------------|
| 29 | GET | `/api/v1/ta/batches/:id/students` | `ta.api.ts` | `useTABatches` |
| 30 | POST | `/api/v1/ta/attendance` | `ta.api.ts` | `useTAAttendance` |
| 31 | POST | `/api/v1/ta/assignments/:id/grade` | `ta.api.ts` | `useTAGrading` |

**Status: [x] 3 / 3**

---

## Admin — Students & Users (4)

| # | Method | Endpoint | Frontend API file | Hook / Page |
|---|--------|----------|-------------------|-------------|
| 32 | GET | `/api/v1/admin/students` | `admin.api.ts` | `useAdminStudents` |
| 33 | GET | `/api/v1/admin/users/:id` | `admin.api.ts` | — |
| 34 | PUT | `/api/v1/admin/users/:id/role` | `admin.api.ts` | — |
| 35 | DELETE | `/api/v1/admin/users/:id` | `admin.api.ts` | — |

**Status: [x] 4 / 4**

---

## Admin — Courses (4)

| # | Method | Endpoint | Frontend API file | Hook / Page |
|---|--------|----------|-------------------|-------------|
| 36 | POST | `/api/v1/admin/courses` | `admin.api.ts` | `useAdminCourses` |
| 37 | PUT | `/api/v1/admin/courses/:id` | `admin.api.ts` | `useAdminCourses` |
| 38 | DELETE | `/api/v1/admin/courses/:id` | `admin.api.ts` | — |
| 39 | POST | `/api/v1/admin/courses/content` | `admin.api.ts` | `CoursesPage` |

**Status: [x] 4 / 4**

---

## Admin — Batches (5)

| # | Method | Endpoint | Frontend API file | Hook / Page |
|---|--------|----------|-------------------|-------------|
| 40 | POST | `/api/v1/admin/batches` | `admin.api.ts` | `useAdminBatches` |
| 41 | PUT | `/api/v1/admin/batches/:id` | `admin.api.ts` | `useAdminBatches` |
| 42 | GET | `/api/v1/admin/batches/:id/students` | `admin.api.ts` | — |
| 43 | POST | `/api/v1/admin/batches/:id/assign-ta` | `admin.api.ts` | — |
| 44 | GET | `/api/v1/admin/batches/:id/attendance` | `admin.api.ts` | — |

**Status: [x] 5 / 5**

---

## Admin — Enrollments (2)

| # | Method | Endpoint | Frontend API file | Hook / Page |
|---|--------|----------|-------------------|-------------|
| 45 | POST | `/api/v1/admin/enrollments` | `admin.api.ts` | — |
| 46 | PUT | `/api/v1/admin/enrollments/:id/status` | `admin.api.ts` | — |

**Status: [x] 2 / 2**

---

## Admin — Enrollment Forms (2)

| # | Method | Endpoint | Frontend API file | Hook / Page |
|---|--------|----------|-------------------|-------------|
| 47 | GET | `/api/v1/admin/enrollment-forms` | `admin.api.ts` | `useAdminEnrollmentRequests` |
| 48 | PUT | `/api/v1/admin/enrollment-forms/:id/status` | `admin.api.ts` | `useAdminEnrollmentRequests` |

**Status: [x] 2 / 2**

---

## Admin — Assignments & Grading (2)

| # | Method | Endpoint | Frontend API file | Hook / Page |
|---|--------|----------|-------------------|-------------|
| 49 | POST | `/api/v1/admin/assignments` | `admin.api.ts` | — |
| 50 | POST | `/api/v1/admin/submissions/:id/grade` | `admin.api.ts` | — |

**Status: [x] 2 / 2**

---

## Admin — Payments (4)

| # | Method | Endpoint | Frontend API file | Hook / Page |
|---|--------|----------|-------------------|-------------|
| 51 | POST | `/api/v1/admin/payments` | `admin.api.ts` | `useAdminPayments` |
| 52 | GET | `/api/v1/admin/payments` | `admin.api.ts` | `useAdminPayments` |
| 53 | GET | `/api/v1/admin/payments/pending` | `admin.api.ts` | — |
| 54 | POST | `/api/v1/admin/payments/:id/reminder` | `admin.api.ts` | — |

**Status: [x] 4 / 4**

---

## Admin — Financials & Analytics (5)

| # | Method | Endpoint | Frontend API file | Hook / Page |
|---|--------|----------|-------------------|-------------|
| 55 | GET | `/api/v1/admin/financials` | `admin.api.ts` | `useAdminFinancialSummary` |
| 56 | GET | `/api/v1/admin/analytics/dashboard` | `admin.api.ts` | `useAdminOverview` |
| 57 | GET | `/api/v1/admin/analytics/revenue` | `admin.api.ts` | — |
| 58 | GET | `/api/v1/admin/analytics/students` | `admin.api.ts` | — |
| 59 | GET | `/api/v1/admin/analytics/courses` | `admin.api.ts` | — |

**Status: [x] 5 / 5**

---

## Admin — Certificates (1)

| # | Method | Endpoint | Frontend API file | Hook / Page |
|---|--------|----------|-------------------|-------------|
| 60 | POST | `/api/v1/admin/certificates/generate` | `admin.api.ts` | `useAdminCertificates` |

**Status: [x] 1 / 1**

---

## Admin Users — separate controller (1)

| # | Method | Endpoint | Frontend API file | Hook / Page |
|---|--------|----------|-------------------|-------------|
| 61 | GET | `/api/v1/admin/users` | `admin.api.ts` | — |

**Status: [x] 1 / 1**

---

## Files (3)

| # | Method | Endpoint | Auth | Frontend API file | Hook / Page |
|---|--------|----------|------|-------------------|-------------|
| 62 | POST | `/api/v1/files/upload` | `ADMIN\|SUPER_ADMIN\|TA\|STUDENT` | `files.api.ts` | assignment/project upload |
| 63 | GET | `/api/v1/files/:id` | `ADMIN\|SUPER_ADMIN\|TA\|STUDENT` | `files.api.ts` | — |
| 64 | DELETE | `/api/v1/files/:id` | `ADMIN\|SUPER_ADMIN\|TA\|STUDENT` | `files.api.ts` | — |

**Status: [x] 3 / 3**

---

## Progress Summary

| Scope | Total | Completed |
|-------|-------|-----------|
| Public | 13 | 13 |
| Users | 3 | 3 |
| Students | 9 | 9 |
| Enrollments | 1 | 1 |
| Assignments & Submissions | 2 | 2 |
| TA | 3 | 3 |
| Admin — Students & Users | 4 | 4 |
| Admin — Courses | 4 | 4 |
| Admin — Batches | 5 | 5 |
| Admin — Enrollments | 2 | 2 |
| Admin — Enrollment Forms | 2 | 2 |
| Admin — Assignments & Grading | 2 | 2 |
| Admin — Payments | 4 | 4 |
| Admin — Financials & Analytics | 5 | 5 |
| Admin — Certificates | 1 | 1 |
| Admin Users controller | 1 | 1 |
| Files | 3 | 3 |
| **Total** | **64** | **64** |
