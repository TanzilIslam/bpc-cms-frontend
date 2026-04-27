# Validation Audit Report - Frontend API Integration

**Date**: 2026-04-27  
**Status**: ✅ **All 64 backend endpoints are implemented**, but **validation coverage is incomplete**

---

## Executive Summary

✅ **Backend Integration**: 13/13 Public + 51/51 Protected endpoints = **64/64 (100%)** endpoints implemented

❌ **Validation Coverage**: Approximately **35-40% of endpoints have proper frontend validation**

**Key Finding**: While all endpoints are integrated, **most lack explicit input validation** before submission. This creates risks of:
- Invalid data being sent to the backend
- Silent failures without clear user feedback
- Security vulnerabilities (XSS, injection)
- Poor UX with generic error messages

---

## Validation Status by Category

### 📋 Public APIs (13 endpoints)

| # | Endpoint | Implementation | Validation | Status |
|---|----------|----------------|-----------|--------|
| 1 | POST `/auth/register` | ✅ | ❌ (Basic type hints only) | **NEEDS WORK** |
| 2 | POST `/auth/login` | ✅ | ⚠️ (Email/password checks in component) | **PARTIAL** |
| 3 | POST `/auth/logout` | ✅ | ✅ | OK |
| 4 | POST `/auth/refresh-token` | ✅ | ✅ | OK |
| 5 | POST `/auth/forgot-password` | ✅ | ❌ (Email validation missing) | **NEEDS WORK** |
| 6 | POST `/auth/reset-password` | ✅ | ❌ (Token/password validation missing) | **NEEDS WORK** |
| 7 | GET `/courses` | ✅ | ✅ | OK |
| 8 | GET `/courses/:slug` | ✅ | ✅ | OK |
| 9 | GET `/courses/:id/content` | ✅ | ✅ | OK |
| 10 | GET `/batches` | ✅ | ✅ | OK |
| 11 | GET `/projects` | ✅ | ✅ | OK |
| 12 | POST `/enrollment-forms` | ✅ | ⚠️ (Client-side only) | **PARTIAL** |
| 13 | GET `/certificates/verify/:code` | ✅ | ✅ | OK |

**Public Summary**: 6 critical issues, 2 partial validations

---

### 👤 User Endpoints (3)

| # | Endpoint | Implementation | Validation | Status |
|---|----------|----------------|-----------|--------|
| 14 | GET `/users/me` | ✅ | ✅ | OK |
| 15 | PUT `/users/me` | ✅ | ⚠️ (Phone regex, other fields loose) | **PARTIAL** |
| 16 | POST `/users/me/avatar` | ✅ | ⚠️ (File type check exists) | **PARTIAL** |

**User Summary**: 1 partial validation with weak field validation

---

### 🎓 Student Endpoints (9)

| # | Endpoint | Implementation | Validation | Status |
|---|----------|----------------|-----------|--------|
| 17 | GET `/students/me` | ✅ | ✅ | OK |
| 18 | GET `/students/me/enrollments` | ✅ | ✅ | OK |
| 19 | GET `/students/me/enrollments/:id/progress` | ✅ | ✅ (ID check) | OK |
| 20 | GET `/students/me/assignments` | ✅ | ✅ | OK |
| 21 | POST `/students/me/assignments/:id/submit` | ✅ | ❌ (No validation on submit DTO) | **NEEDS WORK** |
| 22 | GET `/students/me/progress` | ✅ | ✅ | OK |
| 23 | GET `/students/me/certificate` | ✅ | ✅ | OK |
| 24 | GET `/students/me/payments` | ✅ | ✅ | OK |
| 25 | GET `/students/me/attendance` | ✅ | ✅ | OK |

**Student Summary**: 1 critical issue in assignment submission

---

### 📝 Enrollments (1)

| # | Endpoint | Implementation | Validation | Status |
|---|----------|----------------|-----------|--------|
| 26 | POST `/enrollments` | ✅ | ⚠️ (Batch ID only) | **PARTIAL** |

---

### 📚 Assignments & Submissions (2)

| # | Endpoint | Implementation | Validation | Status |
|---|----------|----------------|-----------|--------|
| 27 | GET `/assignments/:id` | ✅ | ✅ | OK |
| 28 | GET `/submissions/:id` | ✅ | ✅ | OK |

---

### 👨‍🏫 TA Endpoints (3)

| # | Endpoint | Implementation | Validation | Status |
|---|----------|----------------|-----------|--------|
| 29 | GET `/ta/batches/:id/students` | ✅ | ✅ | OK |
| 30 | POST `/ta/attendance` | ✅ | ❌ (Weak attendance DTO validation) | **NEEDS WORK** |
| 31 | POST `/ta/assignments/:id/grade` | ✅ | ❌ (Weak grading DTO validation) | **NEEDS WORK** |

**TA Summary**: 2 critical issues in mutation endpoints

---

### 🔐 Admin Endpoints (40)

#### Students & Users (4)
| 32 | GET `/admin/students` | ✅ | ✅ (Schema parsing) | OK |
| 33 | GET `/admin/users/:id` | ✅ | ✅ | OK |
| 34 | PUT `/admin/users/:id/role` | ✅ | ⚠️ (Role enum only) | **PARTIAL** |
| 35 | DELETE `/admin/users/:id` | ✅ | ✅ | OK |

#### Courses (4)
| 36 | POST `/admin/courses` | ✅ | ⚠️ (Schema exists but loose) | **PARTIAL** |
| 37 | PUT `/admin/courses/:id` | ✅ | ⚠️ (Schema exists but loose) | **PARTIAL** |
| 38 | DELETE `/admin/courses/:id` | ✅ | ✅ | OK |
| 39 | POST `/admin/courses/content` | ✅ | ❌ (No DTO validation) | **NEEDS WORK** |

#### Batches (5)
| 40 | POST `/admin/batches` | ✅ | ⚠️ (Weak validation) | **PARTIAL** |
| 41 | PUT `/admin/batches/:id` | ✅ | ⚠️ (Weak validation) | **PARTIAL** |
| 42 | GET `/admin/batches/:id/students` | ✅ | ✅ | OK |
| 43 | POST `/admin/batches/:id/assign-ta` | ✅ | ⚠️ (Array of IDs only) | **PARTIAL** |
| 44 | GET `/admin/batches/:id/attendance` | ✅ | ✅ | OK |

#### Enrollments (2)
| 45 | POST `/admin/enrollments` | ✅ | ⚠️ (Weak validation) | **PARTIAL** |
| 46 | PUT `/admin/enrollments/:id/status` | ✅ | ⚠️ (Enum only) | **PARTIAL** |

#### Enrollment Forms (2)
| 47 | GET `/admin/enrollment-forms` | ✅ | ✅ | OK |
| 48 | PUT `/admin/enrollment-forms/:id/status` | ✅ | ⚠️ (Enum + notes) | **PARTIAL** |

#### Assignments & Grading (2)
| 49 | POST `/admin/assignments` | ✅ | ❌ (No DTO validation) | **NEEDS WORK** |
| 50 | POST `/admin/submissions/:id/grade` | ✅ | ⚠️ (Weak score/feedback validation) | **PARTIAL** |

#### Payments (4)
| 51 | POST `/admin/payments` | ✅ | ❌ (No DTO validation) | **NEEDS WORK** |
| 52 | GET `/admin/payments` | ✅ | ✅ | OK |
| 53 | GET `/admin/payments/pending` | ✅ | ✅ | OK |
| 54 | POST `/admin/payments/:id/reminder` | ✅ | ✅ | OK |

#### Financials & Analytics (5)
| 55-59 | All GET endpoints | ✅ | ✅ | OK |

#### Certificates (1)
| 60 | POST `/admin/certificates/generate` | ✅ | ⚠️ (Weak validation) | **PARTIAL** |

#### Admin Users (1)
| 61 | GET `/admin/users` | ✅ | ✅ | OK |

#### Files (3)
| 62 | POST `/files/upload` | ✅ | ⚠️ (Type/size checks only) | **PARTIAL** |
| 63 | GET `/files/:id` | ✅ | ✅ | OK |
| 64 | DELETE `/files/:id` | ✅ | ✅ | OK |

**Admin Summary**: 3 critical issues, 13 partial validations

---

## Validation Issues by Severity

### 🔴 Critical (Must Fix Immediately)

1. **POST `/auth/register`** - No password strength validation
   - Contract requires: `password` min 8 chars, but not checked
   - Risk: Weak passwords accepted
   - Fix: Add Zod schema with min/max length, complexity rules

2. **POST `/auth/forgot-password`** - No email format validation
   - Risk: Invalid emails sent to backend
   - Fix: Add email validation in schema

3. **POST `/auth/reset-password`** - No token/password validation
   - Risk: Invalid reset attempts
   - Fix: Add token format check, password strength

4. **POST `/students/me/assignments/:id/submit`** - Missing SubmitAssignmentDto validation
   - Contract requires: `filePaths[]`, optional `githubLink`, `liveDemoLink`, `notes`
   - Risk: Silent failures if data structure wrong
   - Fix: Create and use Zod schema for SubmitAssignmentDto

5. **POST `/ta/attendance`** - Weak MarkAttendanceDto validation
   - Contract requires: `batchId`, `classDate`, `studentId`, `status`, optional `classTopic`, `notes`
   - Current: No explicit schema
   - Fix: Add full Zod schema

6. **POST `/ta/assignments/:id/grade`** - Weak GradeAssignmentDto validation
   - Contract requires: `studentId`, `score`, optional `feedback`, `status`
   - Current: No explicit schema
   - Fix: Add full Zod schema

7. **POST `/admin/courses/content`** - No CreateCourseContentDto validation
   - Risk: Invalid course content structure
   - Fix: Add Zod schema for ContentType, orderIndex, etc.

8. **POST `/admin/assignments`** - No CreateAssignmentDto validation
   - Risk: Invalid assignment data
   - Fix: Add schema validation for assignment type, max score, due date

9. **POST `/admin/payments`** - No RecordPaymentDto validation
   - Contract requires: `enrollmentId`, `studentId`, `amount`, `installmentNumber`, `paymentMethod`, `status`
   - Risk: Invalid payment records
   - Fix: Add Zod schema with proper enum and number validation

### 🟡 Partial (Should Improve)

- **POST `/auth/login`** - Email validation present, but in component not schema
- **POST `/enrollment-forms`** - Has client validation but missing some backend requirements
- **PUT `/users/me`** - Phone regex exists but other fields (dateOfBirth, etc.) loose
- **POST `/users/me/avatar`** - File type check exists but could be stricter
- **POST `/enrollments`** - Only validates batchId, missing other fields
- **PUT `/admin/users/:id/role`** - Only validates role enum
- **POST `/admin/courses`** - Schema exists but has optional `.optional()` on all fields
- **POST `/admin/batches`** - Needs stricter date validation, schedule validation
- **POST `/admin/enrollments`** - Needs full DTO validation
- **PUT `/admin/enrollments/:id/status`** - Only validates enum
- **PUT `/admin/enrollment-forms/:id/status`** - Minimal validation
- **POST `/admin/submissions/:id/grade`** - Score and feedback validation needed
- **POST `/admin/certificates/generate`** - Weak signature validation
- **POST `/files/upload`** - File type/size exist but missing MIME type validation against contract

---

## Current Validation Pattern

### Good Example (admin.api.ts)
```typescript
const paymentSchema = z.object({
  id: z.string().or(z.number()).optional(),
  amount: z.number().or(z.string()).optional(),
  status: paymentStatusSchema.optional(),
  // ... more fields
})
```

✅ Uses Zod for schema validation  
✅ Handles camelCase/snake_case inconsistency  
✅ Parses unknown data safely  
✅ Maps to typed objects

### Bad Example (auth.api.ts)
```typescript
export type RegisterPayload = {
  fullName: string
  email: string
  password: string  // ← No validation that min 8 chars
  phone: string
  address?: string
}
```

❌ TypeScript types only (no runtime validation)  
❌ No min/max length checks  
❌ No format validation (email, phone)  
❌ No backend contract compliance

---

## Validation Priority Matrix

### Phase 1: Critical (Week 1)
- Register password strength
- Forgot/Reset password flow
- Assignment submission DTO
- TA attendance DTO
- TA grading DTO

### Phase 2: High (Week 2)
- Course creation/update
- Batch creation/update
- Payment recording
- Course content creation
- Assignment creation

### Phase 3: Medium (Week 3)
- Enrollment form refinement
- Avatar upload strict MIME check
- User profile update
- Enrollment creation/status update

### Phase 4: Low (Week 4)
- File upload MIME validation
- Certificate generation
- Testimonial/Announcement approval

---

## Implementation Checklist

### Auth Validation
- [ ] Create `src/types/validation/auth.ts` with:
  - RegisterDto (fullName, email, password strength, phone regex BD)
  - LoginDto (email, password)
  - ResetPasswordDto (token min 10, newPassword min 8 + strength)
  - ForgotPasswordDto (email format)

### Student/Assignment Validation
- [ ] Create `src/types/validation/student.ts` with:
  - SubmitAssignmentDto (filePaths array, optional links, notes)

### TA Validation
- [ ] Create `src/types/validation/ta.ts` with:
  - MarkAttendanceDto (required fields, status enum)
  - GradeAssignmentDto (studentId, score 0-100, status enum)

### Admin Validation
- [ ] Create `src/types/validation/admin.ts` with:
  - CreateCourseDto (title, slug, price > 0, durationMonths > 0)
  - CreateBatchDto (dates valid, maxStudents > 0)
  - CreateAssignmentDto (title, type, maxScore validation)
  - RecordPaymentDto (amount > 0, enrollmentId exists, paymentMethod enum)
  - CreateCourseContentDto (contentType enum, orderIndex >= 0)

---

## File Organization

Current structure is good. Add validation schemas:

```
src/
├── types/
│   ├── admin.ts         (models, already exists)
│   ├── auth.ts          (models, already exists)
│   ├── validation/      (← NEW FOLDER)
│   │   ├── auth.ts      (Zod schemas for auth payloads)
│   │   ├── student.ts   (Zod schemas for student payloads)
│   │   ├── ta.ts        (Zod schemas for TA payloads)
│   │   ├── admin.ts     (Zod schemas for admin payloads)
│   │   └── common.ts    (shared validators: phone, email, etc.)
│   └── index.ts
├── api/
│   ├── admin.api.ts     (already has Zod parsing)
│   ├── auth.api.ts      (← needs validation)
│   ├── students.api.ts  (← needs validation)
│   ├── ta.api.ts        (← needs validation)
│   └── ...
```

---

## Backend Validation Contract Compliance

### Enums to Validate

```typescript
// UserRole
"SUPER_ADMIN" | "ADMIN" | "TA" | "STUDENT" | "GUEST" | "ALUMNI"

// UserStatus
"ACTIVE" | "INACTIVE" | "SUSPENDED"

// DifficultyLevel
"BEGINNER" | "INTERMEDIATE" | "ADVANCED"

// ContentType
"VIDEO" | "PDF" | "TEXT" | "LINK"

// BatchStatus
"UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"

// EnrollmentStatus
"PENDING" | "ACTIVE" | "COMPLETED" | "DROPPED" | "SUSPENDED"

// PaymentStatus (enrollment)
"UNPAID" | "PARTIAL" | "FULL"

// PaymentMethod
"CASH" | "BKASH" | "NAGAD" | "BANK_TRANSFER"

// PaymentRecordStatus
"PENDING" | "CONFIRMED" | "FAILED" | "REFUNDED"

// AssignmentType
"PROJECT" | "QUIZ" | "CODE" | "WRITTEN"

// SubmissionStatus
"SUBMITTED" | "GRADED" | "REVISION_NEEDED"

// AttendanceStatus
"PRESENT" | "ABSENT" | "LATE" | "EXCUSED"

// FileType
"IMAGE" | "VIDEO" | "PDF" | "ZIP" | "OTHER"

// FileEntityType
"PROFILE" | "ASSIGNMENT" | "PROJECT" | "COURSE" | "CERTIFICATE"

// EnrollmentFormStatus
"PENDING" | "CONTACTED" | "ENROLLED" | "REJECTED"
```

---

## Error Handling Strategy

All validation should provide clear, user-facing messages:

```typescript
// Before (current)
throw new Error("Invalid data")

// After (target)
if (!formData.password || formData.password.length < 8) {
  errors.password = t("errors.passwordMinLength", { min: 8 })
}

if (!isValidEmail(formData.email)) {
  errors.email = t("errors.invalidEmail")
}

// Show errors to user with i18n support
```

---

## Impact & Benefits

### Security
- Prevent XSS via injection into validation fields
- Reject obviously invalid data before network calls
- Enforce business rules (price > 0, dates sequential, etc.)

### UX
- Instant feedback on form errors
- Clear messages in user's language (i18n)
- Reduce backend error handling burden

### Development
- Type safety with Zod schemas
- Consistency across all endpoints
- Single source of truth for DTO shapes
- Easier testing & maintenance

---

## Testing Strategy

Add unit tests in `src/types/validation/__tests__/`:

```typescript
describe("auth validation", () => {
  it("should reject password < 8 chars", () => {
    expect(() => registerSchema.parse({ 
      password: "short" 
    })).toThrow()
  })
  
  it("should accept valid phone BD format", () => {
    expect(registerSchema.parse({ 
      phone: "+8801700000000" 
    })).toBeDefined()
  })
})
```

---

## References

- Backend Contract: `/API_CONTRACT_OVERVIEW.md`
- Integration Checklist: `/API_INTEGRATION_CHECKLIST.md`
- Zod Docs: https://zod.dev
- i18next: https://www.i18next.com/

---

## Next Steps

1. **Review & Approve**: Verify prioritization with team
2. **Create Schema Library**: Build validation types
3. **Integrate**: Update API files to use schemas
4. **Test**: Add unit test coverage
5. **Iterate**: Monitor backend errors for missed cases
