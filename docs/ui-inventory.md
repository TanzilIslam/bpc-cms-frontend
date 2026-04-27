# UI Inventory

## Form UI currently shown in the app

### Public/Auth forms
- Login form (`/auth/login`) — `src/pages/auth/LoginPage.tsx`
- Register form (`/auth/register`) — `src/pages/auth/RegisterPage.tsx`
- Forgot password form (`/auth/forgot-password`) — `src/pages/auth/ForgotPasswordPage.tsx`
- Reset password form (`/auth/reset-password`) — `src/pages/auth/ResetPasswordPage.tsx`
- Public enrollment form — `src/pages/public/EnrollmentFormPage.tsx`
- Certificate verification form — `src/pages/public/CertificateVerificationPage.tsx`

### Admin forms
- Course content create/edit form — `src/pages/admin/CoursesPage.tsx`
- Course create/edit form — `src/pages/admin/CoursesPage.tsx`
- Batch create/edit form — `src/pages/admin/BatchesPage.tsx`
- Payment create form — `src/pages/admin/PaymentsPage.tsx`
- Certificate issue form — `src/pages/admin/CertificatesPage.tsx`
- Announcement create/edit form — `src/pages/admin/AnnouncementsPage.tsx`
- Enrollment conversion/details update forms — `src/pages/admin/EnrollmentRequestsPage.tsx`
- Expense create/edit form — `src/pages/admin/FinancialsPage.tsx`
- Financial goal create/edit form — `src/pages/admin/FinancialsPage.tsx`

### Student forms
- Project create/edit form — `src/pages/student/MyProjectsPage.tsx`

---

## Table UI currently shown in the app

### Admin tables
- Students table — `src/pages/admin/StudentsPage.tsx`
- Payments table — `src/pages/admin/PaymentsPage.tsx`
- Certificates table — `src/pages/admin/CertificatesPage.tsx`
- Enrollment requests table — `src/pages/admin/EnrollmentRequestsPage.tsx`
- Announcements table — `src/pages/admin/AnnouncementsPage.tsx`
- Testimonials table — `src/pages/admin/TestimonialsPage.tsx`

### Student tables
- Student payments table — `src/pages/student/PaymentsPage.tsx`

---

## Shared building blocks used by these pages
- Form helper UI: `src/components/shared/AdminForm.tsx`
- Table helper UI: `src/components/shared/AdminTable.tsx`
- Base table primitive: `src/components/ui/table.tsx`

---

## Form quality review (improvement list)

### 1) Validation schema synchronization gaps
- **Schema coverage is inconsistent:** only the public enrollment form uses `react-hook-form + zodResolver`; most other forms use local state plus ad-hoc checks. This creates drift risk between frontend constraints and backend payload contracts.
- **Auth forms have no central schema:** login/register/forgot/reset rely mostly on HTML `required` and a few inline checks. Add one schema per form for email, phone, password rules, and confirm-password matching to keep behavior consistent.
- **Admin dialog forms duplicate rules in submit handlers:** courses/batches/payments/announcements validate with manual `if` chains. Move these into shared Zod schemas (`src/lib/validation/*`) and reuse both for UI errors and payload shaping.
- **Audience-field dependency not enforced at form level:** announcement form has optional `batchId/courseId`, but no conditional validation tied to selected audience. Add conditional schema rules (`BATCH_SPECIFIC => batchId required`, `COURSE_SPECIFIC => courseId required`).

### 2) Proper validation improvements
- **Phone validation should be stricter:** current enrollment rule is `min(11)`; use regex + normalization (strip spaces/dashes) and country-aware message.
- **String trimming should happen in schema transforms:** several forms trim during submit only. Use schema transforms so UI and submit payload always reflect the same value.
- **Numeric coercion should be schema-driven:** amounts/order/duration are parsed manually with `Number(...)`. Prefer `z.coerce.number()` with min/max constraints to avoid inconsistent parsing.
- **Field-level error placement is uneven:** many admin dialogs show only one top-level `formError`. Return per-field errors from schema parsing and map to each `AdminFormField` to reduce correction time.

### 3) UI/UX synchronization improvements
- **Use semantic `<form>` inside dialog content:** many admin/student dialog forms submit via button `onClick` only. Wrapping controls in `<form onSubmit>` improves Enter-key submission, accessibility, and browser validation behavior.
- **Replace native checkbox/radio with shared UI primitives:** several forms still use raw `<input type="checkbox|radio">` while the project has `Switch`/`Checkbox` components. Standardizing improves consistency and focus states.
- **Add helper text for constrained fields:** examples: course slug format, payment transaction ID format, accepted certificate code pattern.
- **Disable dependent inputs when not applicable:** e.g., announcement `batchId/courseId` should disable/hide based on selected audience to prevent invalid combinations.

### 4) Prioritized implementation scope (recommended)
1. Create shared schemas for auth + admin dialog forms and migrate submit handlers to schema parsing.
2. Convert dialog actions to semantic `<form>` submissions.
3. Add conditional validation/dependent UI behavior for announcement audience fields.
4. Improve field-level error mapping in `AdminFormField` usage.
5. Normalize phone/password/number rules and reuse across pages.

### 5) Implementation progress
- ✅ **Step 1 started (auth forms completed):**
  - Added shared auth validation schemas in `src/lib/validation/auth.ts`.
  - Migrated `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, and `ResetPasswordPage` to schema-based validation (`safeParse`) with centralized error message extraction.
- ⏳ **Next:** migrate admin dialog forms to shared schemas.
