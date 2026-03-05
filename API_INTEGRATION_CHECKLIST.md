# API Integration Checklist (Frontend ↔ Backend)

This checklist tracks integration progress for the **28 documented backend APIs**.

## Status legend
- [ ] Not started
- [~] In progress
- [x] Integrated
- [!] Blocked (contract/env issue)

## 1) Public APIs (11)

| # | Module | Method | Endpoint | Auth/Role | Status | Frontend API file | Hook/Page mapping | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Auth | POST | `/api/v1/auth/register` | Public | [x] | `src/api/auth.api.ts` | `src/pages/auth/RegisterPage.tsx` |  |
| 2 | Auth | POST | `/api/v1/auth/login` | Public | [x] | `src/api/auth.api.ts` | `src/pages/auth/LoginPage.tsx` |  |
| 3 | Auth | POST | `/api/v1/auth/logout` | Public | [x] | `src/api/auth.api.ts` | `src/hooks/useAuth.ts` |  |
| 4 | Auth | POST | `/api/v1/auth/refresh-token` | Public | [x] | `src/api/auth.api.ts` | `src/api/client.ts` |  |
| 5 | Auth | POST | `/api/v1/auth/forgot-password` | Public | [x] | `src/api/auth.api.ts` | `src/pages/auth/ForgotPasswordPage.tsx` |  |
| 6 | Auth | POST | `/api/v1/auth/reset-password` | Public | [x] | `src/api/auth.api.ts` | `src/pages/auth/ResetPasswordPage.tsx` |  |
| 7 | Courses | GET | `/api/v1/courses` | Public | [x] | `src/api/courses.api.ts` | `src/hooks/useCourses.ts` |  |
| 8 | Courses | GET | `/api/v1/courses/:slug` | Public | [x] | `src/api/courses.api.ts` | `src/pages/public/CourseDetailPage.tsx` |  |
| 9 | Projects | GET | `/api/v1/projects` | Public | [x] | `src/api/projects.api.ts` | `src/hooks/useProjects.ts` |  |
| 10 | Enrollment Forms | POST | `/api/v1/enrollment-forms` | Public | [x] | `src/api/enrollment-forms.api.ts` | `src/pages/public/EnrollmentFormPage.tsx` |  |
| 11 | Certificates | GET | `/api/v1/certificates/verify/:code` | Public | [x] | `src/api/certificates.api.ts` | `src/hooks/useCertificateVerification.ts` |  |

## 2) Protected APIs (17)

| # | Module | Method | Endpoint | Auth/Role | Status | Frontend API file | Hook/Page mapping | Notes |
|---|---|---|---|---|---|---|---|---|
| 12 | Students | GET | `/api/v1/students/me` | `STUDENT` | [x] | `src/api/students.api.ts` | `src/pages/student/DashboardPage.tsx` |  |
| 13 | Students | GET | `/api/v1/students/me/enrollments` | `STUDENT` | [x] | `src/api/enrollments.api.ts` | `src/hooks/useEnrollments.ts` |  |
| 14 | Students | GET | `/api/v1/students/me/assignments` | `STUDENT` | [x] | `src/api/assignments.api.ts` | `src/hooks/useAssignments.ts` |  |
| 15 | Students | POST | `/api/v1/students/me/assignments/:id/submit` | `STUDENT` | [x] | `src/api/assignments.api.ts` | `src/pages/student/AssignmentsPage.tsx` |  |
| 16 | Students | GET | `/api/v1/students/me/progress` | `STUDENT` | [x] | `src/api/enrollments.api.ts` | `src/pages/student/MyProgressPage.tsx` |  |
| 17 | Students | GET | `/api/v1/students/me/certificate` | `STUDENT` | [x] | `src/api/certificates.api.ts` | `src/hooks/useMyCertificate.ts` | returns list |
| 18 | TA | GET | `/api/v1/ta/batches/:id/students` | `TA|ADMIN|SUPER_ADMIN` | [x] | `src/api/ta.api.ts` | `src/hooks/useTABatches.ts` |  |
| 19 | TA | POST | `/api/v1/ta/attendance` | `TA|ADMIN|SUPER_ADMIN` | [x] | `src/api/ta.api.ts` | `src/hooks/useTAAttendance.ts` |  |
| 20 | TA | POST | `/api/v1/ta/assignments/:id/grade` | `TA|ADMIN|SUPER_ADMIN` | [x] | `src/api/ta.api.ts` | `src/hooks/useTAGrading.ts` |  |
| 21 | Admin | GET | `/api/v1/admin/students` | `ADMIN|SUPER_ADMIN` | [x] | `src/api/admin.api.ts` | `src/hooks/useAdminStudents.ts` |  |
| 22 | Admin | POST | `/api/v1/admin/courses` | `ADMIN|SUPER_ADMIN` | [x] | `src/api/admin.api.ts` | `src/hooks/useAdminCourses.ts` |  |
| 23 | Admin | POST | `/api/v1/admin/batches` | `ADMIN|SUPER_ADMIN` | [x] | `src/api/admin.api.ts` | `src/hooks/useAdminBatches.ts` |  |
| 24 | Admin | POST | `/api/v1/admin/courses/content` | `ADMIN|SUPER_ADMIN` | [x] | `src/api/admin.api.ts` | `src/pages/admin/CoursesPage.tsx` |  |
| 25 | Admin | POST | `/api/v1/admin/payments` | `ADMIN|SUPER_ADMIN` | [x] | `src/api/admin.api.ts` | `src/hooks/useAdminPayments.ts` |  |
| 26 | Admin | GET | `/api/v1/admin/financials` | `ADMIN|SUPER_ADMIN` | [x] | `src/api/admin.api.ts` | `src/hooks/useAdminFinancialSummary.ts` |  |
| 27 | Admin | POST | `/api/v1/admin/certificates/generate` | `ADMIN|SUPER_ADMIN` | [x] | `src/api/admin.api.ts` | `src/hooks/useAdminCertificates.ts` |  |
| 28 | Files | POST | `/api/v1/files/upload` | `ADMIN|SUPER_ADMIN|TA|STUDENT` | [x] | `src/api/files.api.ts` | assignment upload flow wired; project/profile pending UI wiring | multipart |

---

## Suggested execution order
1. Auth (1–6)
2. Public read/submit (7–11)
3. Student (12–17)
4. TA (18–20)
5. Admin (21–27)
6. Files (28)

## Progress summary
- Total APIs: **28**
- Completed: **28**
- In progress: **0**
- Blocked: **0**
