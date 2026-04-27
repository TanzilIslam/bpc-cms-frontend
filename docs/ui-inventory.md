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

---

## Table quality review (improvement list)

### 1) Structure and consistency
- **Good baseline:** all admin/student tables already share `AdminTable` wrappers (`AdminTable`, `AdminTableHeader`, `AdminTableBody`, row/cell primitives), which keeps style consistent.
- **Improve semantic metadata:** add `scope="col"` to header cells and consider `caption` support in `AdminTable` for screen-reader context on each page.
- **Unify empty-state handling:** some pages use `EmptyStatePanel`, others render plain text; standardizing one pattern will improve consistency and reuse.

### 2) UX improvements
- **Add sortable columns where users scan often:** Students (`Name`, `Joined`) and Payments (`Date`, `Amount`) are good first candidates.
- **Add pagination or virtualization for scale:** current tables render all filtered rows at once; this may impact responsiveness as datasets grow.
- **Sticky header on long lists:** helps readability on large tables with horizontal/vertical scrolling.
- **Column alignment pass:** right-align numeric currency/date columns for quicker visual scanning.

### 3) Accessibility improvements
- **Keyboard focus visibility for row actions:** ensure action buttons in tables have clear focus rings and predictable tab order.
- **Associate filter controls with table intent:** for search/filter inputs, keep explicit `aria-label` patterns and tie to table context labels.
- **Status badges should include text fallback:** badge color is good, but text should remain the primary state signal (already mostly true; keep it consistent).

### 4) Data/format synchronization improvements
- **Centralize table column configs:** define per-page column metadata (header label, render fn, sort key) to reduce duplication and drift.
- **Consistent date/currency formatting:** continue routing through `formatDate` / `formatMoney`; avoid inline formatting in new tables.
- **Normalize status mapping:** keep using shared badge variant mapping helpers so status color rules remain uniform across pages.

### 5) Prioritized table implementation scope (recommended)
1. Add semantic improvements (`scope`, optional `caption`) in `AdminTable` primitives.
2. Standardize empty states across all table pages (`EmptyStatePanel` pattern).
3. Implement client-side sorting + pagination in Students and Payments first.
4. Extract reusable column configs/helpers for repeated table patterns.
5. Add sticky headers and numeric alignment refinements for dense data tables.

---

## Loader / Skeleton / Toast audit + rollout plan

### 1) Current loader coverage (already implemented)
- **Page-level loading states (`PageLoadingState`)** are present across Admin, Student, and TA dashboards/workspaces:
  - Admin: `Dashboard`, `Students`, `Courses`, `Batches`, `Payments`, `Certificates`, `EnrollmentRequests`, `Announcements`, `Financials`, `Analytics`, `Testimonials`.
  - Student: `MyCourses`, `CourseView`, `Assignments`, `Payments`, `MyProjects`, `MyCertificate`, `MyProgress`.
  - TA: `MyBatches`, `Attendance`, `Grading`, `StudentProgress`.
- **Button-level loading labels/disabled states** are used in key submit flows (`Submitting...`, `Saving...`, `Generating...`, etc.) for forms and dialogs.
- **Mutation/resource hooks already stop loaders in `finally` blocks** (`useAsyncResource` and `useAsyncMutation`), which is the correct baseline for success/failure completion.

### 2) Toast coverage (gap)
- `sonner` toaster component exists (`src/components/ui/sonner.tsx`), but app-level toast usage is not wired in pages yet.
- Current UX relies mostly on inline errors (`InlineErrorMessage`) and local success text blocks.
- **Gap:** no consistent success toast for create/update/delete flows, and no standard toast fallback path for backend messages.

### 3) Places where skeletons should be added first (high impact)
- **Public listings with card grids currently show plain loading text** and are good skeleton candidates:
  - `HomePage` featured courses / announcements / testimonials blocks.
  - `CoursesPage` course grid.
  - `ProjectShowcasePage` project card grid.
- **Table-heavy pages** can use row skeletons while reloading/filtering large datasets:
  - Admin `Students`, `Payments`, `EnrollmentRequests`, `Testimonials`.
  - Student `Payments`.
- **Verification/detail flows** can use compact skeleton panels:
  - `CertificateVerificationPage` result panel while request is in flight.

### 4) Standardized loading/toast/error contract (to implement)
1. **Global toaster mount:** add `<Toaster />` once at app root layout level.
2. **Mutation success toast:** on successful create/update/delete, show backend message if available; fallback to a deterministic success message.
3. **Mutation failure toast:** use backend error message first, fallback to existing hook-level fallback error string.
4. **Keep inline errors for field/form context**, but use toast for cross-page/global action feedback.
5. **No stuck loading states rule:** every async handler must set loading flags in `finally` (or delegate to `useAsyncMutation`).

### 5) Backend message + fallback policy (single rule everywhere)
- **Success:** `response.message ?? "<Action> completed successfully."`
- **Error:** `error.message ?? "<Action> failed. Please try again."`
- Apply this policy to all mutation-heavy pages first:
  - Admin: `Courses`, `Batches`, `Payments`, `Certificates`, `EnrollmentRequests`, `Announcements`, `Financials`, `Testimonials`.
  - Student: `MyProjects`, assignment submission flow.
  - TA: attendance submission, grading submission.

### 6) Execution order (do this first)
1. Wire global `<Toaster />` in app root.
2. Add shared toast helpers (success/error extractor with backend-first fallback).
3. Migrate Admin mutation pages to toast helper (keep existing inline error blocks for context).
4. Add skeleton components for public listing pages.
5. Add table row skeletons for top admin/student tables.
6. Audit remaining async handlers for `finally`-based loader reset.

### 7) Progress update
- ✅ Global `<Toaster />` mounted at app root (`src/App.tsx`).
- ✅ Shared fallback message helper added (`src/lib/feedback.ts`).
- ✅ First mutation page wired to toast contract: `AdminPaymentsPage` now shows success + backend/fallback error toast while preserving inline form error context.
