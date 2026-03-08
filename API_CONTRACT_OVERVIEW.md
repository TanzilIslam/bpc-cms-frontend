# API Contract Overview

This document summarizes the full API surface of `bpc-cms-backend` as consumed by this frontend.

- **Global prefix:** `api/v1`
- **Success envelope:** `{ success: true, message, data, timestamp }`
- **Error envelope:** `{ success: false, message, errors?, timestamp, path, method }`
- All endpoint descriptions refer to the `data` field of the success envelope.

---

## Public Endpoints

### Auth — `/api/v1/auth`

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| POST | `/register` | `RegisterDto` | `{ user, accessToken, refreshToken }` |
| POST | `/login` | `LoginDto` | `{ user, accessToken, refreshToken }` |
| POST | `/logout` | `LogoutDto` | `{ message }` |
| POST | `/refresh-token` | `RefreshTokenDto` | `{ user, accessToken, refreshToken }` |
| POST | `/forgot-password` | `ForgotPasswordDto` | `{ message }` |
| POST | `/reset-password` | `ResetPasswordDto` | `{ message }` |

### Courses — `/api/v1/courses`

| Method | Path | Response `data` |
|--------|------|-----------------|
| GET | `/` | Published courses list (includes `skillsCovered: string[]`) |
| GET | `/:slug` | Published course detail (includes `skillsCovered: string[]`) |
| GET | `/:id/content` | Course content list for the given course ID |

### Batches — `/api/v1/batches`

| Method | Path | Response `data` |
|--------|------|-----------------|
| GET | `/` | Public batches list |

### Projects — `/api/v1/projects`

| Method | Path | Response `data` |
|--------|------|-----------------|
| GET | `/` | Public projects list (includes `technologiesUsed: string[]`, `screenshots: string[]`) |

### Enrollment Forms — `/api/v1/enrollment-forms`

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| POST | `/` | `CreateEnrollmentFormDto` | Persisted form row (`status: PENDING`) |

### Certificates — `/api/v1/certificates`

| Method | Path | Response `data` |
|--------|------|-----------------|
| GET | `/verify/:code` | `{ certificateCode, isVerified, issueDate, grade, skillsEarned, verificationLink }` |

---

## Protected Endpoints

### Users — `/api/v1/users` (any authenticated role)

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| GET | `/me` | — | Full user profile |
| PUT | `/me` | `UpdateMyProfileDto` | Updated user profile |
| POST | `/me/avatar` | `multipart/form-data` (`file` field, image only, max 5 MB) | `{ avatarPath }` |

### Students — `/api/v1/students` (role: `STUDENT`)

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| GET | `/me` | — | Student profile subset |
| GET | `/me/enrollments` | — | Enrollment list |
| GET | `/me/enrollments/:id/progress` | — | Progress detail for a specific enrollment |
| GET | `/me/assignments` | — | Assignments mapped from enrolled courses |
| POST | `/me/assignments/:id/submit` | `SubmitAssignmentDto` | Saved submission row |
| GET | `/me/progress` | — | `{ overallProgress, courses: [{ enrollmentId, courseId, progressPercentage }] }` |
| GET | `/me/certificate` | — | Student certificate list (note: singular path, list response) |
| GET | `/me/payments` | — | Payment records list |
| GET | `/me/attendance` | — | Attendance records list |

### Enrollments — `/api/v1/enrollments` (role: `STUDENT`)

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| POST | `/` | `StudentCreateEnrollmentDto` (`batchId`) | Saved enrollment row |

### Assignments — `/api/v1/assignments` (any authenticated role)

| Method | Path | Response `data` |
|--------|------|-----------------|
| GET | `/:id` | Assignment detail (access-controlled by role) |

### Submissions — `/api/v1/submissions` (any authenticated role)

| Method | Path | Response `data` |
|--------|------|-----------------|
| GET | `/:id` | Submission detail (access-controlled by role) |

### TA — `/api/v1/ta` (roles: `TA | ADMIN | SUPER_ADMIN`)

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| GET | `/batches/:id/students` | — | Students in a batch (enrollment + status/payment summary) |
| POST | `/attendance` | `MarkAttendanceDto` | Saved attendance row |
| POST | `/assignments/:id/grade` | `GradeAssignmentDto` | Updated submission row (grade/feedback/status/gradedBy) |

### Admin — `/api/v1/admin` (roles: `ADMIN | SUPER_ADMIN`)

#### Students & Users

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| GET | `/students` | — | Users with `role = STUDENT` |
| GET | `/users/:id` | — | User record by ID |
| PUT | `/users/:id/role` | `UpdateUserRoleDto` | Updated user record |
| DELETE | `/users/:id` | — | Confirmation message |

#### Courses

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| POST | `/courses` | `CreateCourseDto` | Saved course row |
| PUT | `/courses/:id` | `UpdateCourseDto` | Updated course row |
| DELETE | `/courses/:id` | — | Confirmation message |
| POST | `/courses/content` | `CreateCourseContentDto` | Saved course-content row |

#### Batches

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| POST | `/batches` | `CreateBatchDto` | Saved batch row |
| PUT | `/batches/:id` | `UpdateBatchDto` | Updated batch row |
| GET | `/batches/:id/students` | — | Students enrolled in the batch |
| POST | `/batches/:id/assign-ta` | `AssignTaDto` | Updated batch with TA assignments |
| GET | `/batches/:id/attendance` | — | Attendance records for the batch |

#### Enrollments

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| POST | `/enrollments` | `AdminCreateEnrollmentDto` | Saved enrollment row |
| PUT | `/enrollments/:id/status` | `UpdateEnrollmentStatusDto` | Updated enrollment row |

#### Enrollment Forms

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| GET | `/enrollment-forms` | — | All enrollment form submissions |
| PUT | `/enrollment-forms/:id/status` | `UpdateEnrollmentFormStatusDto` | Updated enrollment form row |

#### Assignments & Grading

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| POST | `/assignments` | `CreateAssignmentDto` | Saved assignment row |
| POST | `/submissions/:id/grade` | `GradeSubmissionDto` | Updated submission row (grade/feedback/status) |

#### Payments

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| POST | `/payments` | `RecordPaymentDto` | Saved payment row (also updates enrollment `amountPaid`) |
| GET | `/payments` | — | All payment records |
| GET | `/payments/pending` | — | Payment records with status `PENDING` |
| POST | `/payments/:id/reminder` | — | Reminder confirmation |

#### Financials & Analytics

| Method | Path | Response `data` |
|--------|------|-----------------|
| GET | `/financials` | `{ totalRevenue, totalPayments, outstandingAmount }` |
| GET | `/analytics/dashboard` | Overview metrics (student count, revenue, enrollments, etc.) |
| GET | `/analytics/revenue` | Revenue breakdown data |
| GET | `/analytics/students` | Student analytics data |
| GET | `/analytics/courses` | Course analytics data |

#### Certificates

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| POST | `/certificates/generate` | `GenerateCertificateDto` | Generated (or existing) certificate row |

### Admin Users — `/api/v1/admin/users` (separate controller, roles: `ADMIN | SUPER_ADMIN`)

| Method | Path | Response `data` |
|--------|------|-----------------|
| GET | `/` | All users (SUPER_ADMIN sees all roles; ADMIN sees filtered) |

### Files — `/api/v1/files` (roles: `ADMIN | SUPER_ADMIN | TA | STUDENT`)

| Method | Path | Payload | Response `data` |
|--------|------|---------|-----------------|
| POST | `/upload` | `multipart/form-data` (`file` field + `UploadFileDto`), max 10 MB | Saved file metadata row |
| GET | `/:id` | — | File metadata (access-controlled: owner or admin) |
| DELETE | `/:id` | — | Confirmation message (access-controlled: owner or admin) |

Allowed upload MIME types: `image/jpeg`, `image/png`, `image/gif`, `application/pdf`, `text/plain`, `application/zip`, `video/mp4`

---

## Payload DTOs

### Auth
- `RegisterDto`: `email`, `password` (min 8), `fullName`, `phone` (BD regex), optional `address`
- `LoginDto`: `email`, `password` (min 8)
- `LogoutDto`: `refreshToken` (min 10)
- `RefreshTokenDto`: `refreshToken` (min 10)
- `ForgotPasswordDto`: `email`
- `ResetPasswordDto`: `token` (min 10), `newPassword` (min 8)

### Users
- `UpdateMyProfileDto`: optional `fullName`, `phone`, `address`, `laptopSpecs`, `internetSpeed`, `dateOfBirth`

### Enrollment Forms
- `CreateEnrollmentFormDto`: `fullName`, `email`, `phone`, `interestedCourse`, `hasLaptop`, optional `laptopSpecs`, `hasInternet`, optional `whyJoin`

### Students
- `SubmitAssignmentDto`: `filePaths: string[]`, optional `githubLink`, `liveDemoLink`, `notes`
- `StudentCreateEnrollmentDto`: `batchId`

### TA
- `MarkAttendanceDto`: `batchId`, `classDate`, optional `classTopic`, `studentId`, `status` (`AttendanceStatus`), optional `notes`
- `GradeAssignmentDto`: `studentId`, `score`, optional `feedback`, `status` (`SubmissionStatus`)

### Admin
- `CreateCourseDto`: `title`, `slug`, `description`, `durationMonths`, `price`, `difficultyLevel`, `isPublished`, optional `installmentPlan`, `thumbnail`
- `UpdateCourseDto`: all `CreateCourseDto` fields optional
- `CreateBatchDto`: `courseId`, `batchName`, `batchCode`, `startDate`, `endDate`, `schedule`, `maxStudents`, `status`, optional `instructorId`, `taIds[]`, `meetingLink`, `isFree`
- `UpdateBatchDto`: all `CreateBatchDto` fields optional
- `AssignTaDto`: `taIds: string[]`
- `CreateCourseContentDto`: `courseId`, `moduleTitle`, `contentTitle`, `contentType`, `content`, `orderIndex`, `isPreview`
- `AdminCreateEnrollmentDto`: `studentId`, `batchId`, `courseId`, optional `totalFee`, `paymentStatus`, `enrollmentStatus`, `accessType`
- `UpdateEnrollmentStatusDto`: `enrollmentStatus`, optional `finalGrade`
- `UpdateEnrollmentFormStatusDto`: `status` (`EnrollmentFormStatus`), optional `notes`
- `CreateAssignmentDto`: `courseContentId`, `title`, `assignmentType`, optional `description`, `maxScore`, `dueDate`, `requiredFiles[]`, `submissionInstructions`
- `GradeSubmissionDto`: optional `score`, optional `feedback`, `status` (`SubmissionStatus`)
- `RecordPaymentDto`: `enrollmentId`, `studentId`, `amount`, `installmentNumber`, `paymentMethod`, `status`, optional `transactionId`, `notes`
- `GenerateCertificateDto`: `enrollmentId`, optional `signatureName`, `signatureTitle`
- `UpdateUserRoleDto`: `role` (`UserRole`)
- `UploadFileDto`: `entityType` (`FileEntityType`), `entityId`, `isPublic`

---

## Enums

### Access & User
- `UserRole`: `SUPER_ADMIN | ADMIN | TA | STUDENT | GUEST | ALUMNI`
- `UserStatus`: `ACTIVE | INACTIVE | SUSPENDED`

### Course / Content Lifecycle
- `DifficultyLevel`: `BEGINNER | INTERMEDIATE | ADVANCED`
- `ContentType`: `VIDEO | PDF | TEXT | LINK`
- `BatchStatus`: `UPCOMING | ONGOING | COMPLETED | CANCELLED`
- `EnrollmentStatus`: `PENDING | ACTIVE | COMPLETED | DROPPED | SUSPENDED`
- `AccessType`: `LIVE | RECORDED | BOTH`

### Payment / Finance
- `PaymentStatus` (enrollment): `UNPAID | PARTIAL | FULL`
- `PaymentMethod`: `CASH | BKASH | NAGAD | BANK_TRANSFER`
- `PaymentRecordStatus`: `PENDING | CONFIRMED | FAILED | REFUNDED`
- `ExpenseCategory`: `INTERNET | ELECTRICITY | EQUIPMENT | MARKETING | TA_PAYMENT | OTHER`
- `GoalStatus`: `ACTIVE | ACHIEVED | CANCELLED`

### Assignment / Attendance / Files
- `AssignmentType`: `PROJECT | QUIZ | CODE | WRITTEN`
- `SubmissionStatus`: `SUBMITTED | GRADED | REVISION_NEEDED`
- `AttendanceStatus`: `PRESENT | ABSENT | LATE | EXCUSED`
- `FileType`: `IMAGE | VIDEO | PDF | ZIP | OTHER`
- `FileEntityType`: `PROFILE | ASSIGNMENT | PROJECT | COURSE | CERTIFICATE`

### Communication
- `AnnouncementAudience`: `ALL | BATCH_SPECIFIC | COURSE_SPECIFIC`
- `AnnouncementPriority`: `LOW | MEDIUM | HIGH`
- `EnrollmentFormStatus`: `PENDING | CONTACTED | ENROLLED | REJECTED`

---

## Known Quirks

- **Numeric-as-string:** `amount`, `price`, `score`, `fileSize` may be returned as strings. Do not assume strict numeric JSON types.
- **Singular path, list response:** `GET /students/me/certificate` returns an array.
- **Two enrollment creation paths:** `POST /api/v1/enrollments` (student, `batchId` only) vs `POST /api/v1/admin/enrollments` (admin, full DTO).
- **Two grading paths:** `POST /ta/assignments/:id/grade` (by assignment ID + `studentId`) vs `POST /admin/submissions/:id/grade` (by submission ID, `score` optional).
- **Admin users controller:** `GET /admin/users` is a separate controller from the main admin routes.
- **Avatar upload** (`POST /users/me/avatar`) only accepts images (jpeg/png/gif/webp), max 5 MB — separate from `POST /files/upload`.
