# Frontend Implementation Status

Updated: 2026-02-20

## Planned

- Translate remaining dashboard and form pages to Bengali/English via i18n keys.
- Add low-bandwidth/media optimization pass (image sizing + lazy loading audit).
- Final accessibility pass (focus order, labels, contrast checks).
- Optional: add automated tests later if test packages are approved.

## Doing Now

- Stabilize the new i18n foundation in shared layouts/pages and expand key coverage incrementally.

## Done

- Node and npm runtime enforcement (`Node 24.x`, `npm 11.6.2`) via preinstall/pre* checks.
- Frontend structure for public, student, TA, and admin flows.
- Major reusability and duplication cleanup across shared components, admin/student/TA pages, and API/hook layers.
- Shared reusable UI blocks (`AdminTable`, `AdminSection`, `PageHeader`, `MetricCard`, `AsyncStates`, etc.).
- Role-based route protection (`ProtectedRoute`, `RoleRoute`) and lazy-loaded route config.
- i18n foundation added:
  - `src/i18n/index.ts`
  - `src/i18n/resources/en.ts`
  - `src/i18n/resources/bn.ts`
  - `src/components/shared/LanguageSwitcher.tsx`
  - wired into `src/main.tsx`, `src/components/layout/PublicLayout.tsx`, `src/components/layout/DashboardLayout.tsx`, `src/pages/public/HomePage.tsx`, and `src/components/shared/CourseCard.tsx`
- Current checks passing: `npm run lint`, `npm run build`.

## Next

1. Expand i18n keys to remaining high-traffic pages (auth, enrollment, dashboard summaries).
2. Centralize date/number formatting for locale-aware output.
3. Run a final duplication sweep for small page-level helper functions.
