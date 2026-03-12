# GEMINI.md - BPC CMS Frontend

## Project Overview
A modern React-based Management System (CMS) frontend for Bhola Programming Club (BPC). This application handles public course displays, student enrollments, assignment submissions, TA grading, and comprehensive administrative management (courses, batches, financials, analytics).

- **Architecture**: Single Page Application (SPA) with role-based routing.
- **Core Tech Stack**: React 19, TypeScript 5, Vite 8 (beta), Tailwind CSS v4.
- **Styling**: shadcn/ui components built on top of Radix UI and Tailwind v4.
- **State Management**: Zustand for auth and global state.
- **Data Fetching**: Axios with custom interceptors and Zod for schema validation.
- **Routing**: React Router v7 with lazy loading and protected/role-based routes.
- **i18n**: Internationalization support for English (en) and Bengali (bn) using i18next.

## Runtime Requirements
**Strict enforcement** is in place via `scripts/check-runtime.cjs`:
- **Node.js**: `24.x`
- **npm**: `11.6.2`

Running `npm install` or `npm run dev` will fail if these versions are not met.

## Key Commands
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Type-checks (tsc) and builds for production.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run preview`: Previews the production build locally.
- `npm run check:runtime`: Manually verify Node/npm versions.

## Project Structure
- `src/api/`: Service definitions using Axios. See `API_CONTRACT_OVERVIEW.md` for the full surface.
- `src/components/`:
  - `layout/`: Main app wrappers (`PublicLayout`, `DashboardLayout`).
  - `shared/`: Reusable high-level components (`AdminTable`, `MetricCard`, `AsyncStates`).
  - `ui/`: Base shadcn/ui components.
- `src/hooks/`: Data fetching hooks (prefixed with `useAdmin`, `useStudent`, `useTA`, etc.).
- `src/i18n/`: Translation resources and initialization.
- `src/pages/`: Route-level components organized by role.
- `src/routes/`: Router configuration and route protection logic.
- `src/store/`: Zustand stores (e.g., `authStore.ts`).
- `src/types/`: Centralized TypeScript interfaces matching the API contract.

## Development Conventions
- **Component Patterns**:
  - Prefer functional components with TypeScript.
  - Use `lazy()` and `withSuspense` helper in `src/routes/index.tsx` for all page-level components.
  - Adhere to the `shadcn/ui` pattern for low-level UI components.
- **API Integration**:
  - Use `extractApiData` and `extractApiItems` from `src/api/http.ts` to handle backend response envelopes.
  - Use `getHttpErrorMessage` for consistent error reporting from Axios errors.
- **Routing**:
  - `ProtectedRoute`: Ensures user is authenticated.
  - `RoleRoute`: Restricts access based on `UserRole` (STUDENT, TA, ADMIN, SUPER_ADMIN).
- **Internationalization**:
  - All user-facing strings must be wrapped in `t()` from `useTranslation`.
  - Keys should be added to both `src/i18n/resources/en.ts` and `bn.ts`.
- **Styling**:
  - Use Tailwind v4 utility classes.
  - Follow the existing theme variables defined in `src/index.css`.

## Reference Documentation
- `README.md`: Basic setup and environment variables.
- `IMPLEMENTATION_STATUS.md`: Current progress and upcoming tasks.
- `API_CONTRACT_OVERVIEW.md`: Comprehensive list of backend endpoints and DTOs.
- `API_INTEGRATION_CHECKLIST.md`: Checklist for adding new API features.
