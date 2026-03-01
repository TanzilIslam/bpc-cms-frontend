import { NavLink, Outlet } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher"
import { env } from "@/config/env"
import { cn } from "@/lib/utils"

function navClassName(isActive: boolean): string {
  return cn(
    "text-sm font-medium transition-colors",
    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
  )
}

export function PublicLayout() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen">
      <header className="border-b bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:h-14 md:flex-row md:items-center md:justify-between md:gap-4 md:py-0">
          <NavLink to="/" className="text-sm font-semibold tracking-wide">
            {t("app.name", { defaultValue: env.appName })}
          </NavLink>
          <nav className="flex flex-wrap items-center justify-end gap-3">
            <NavLink to="/" end className={({ isActive }) => navClassName(isActive)}>
              {t("public.nav.home")}
            </NavLink>
            <NavLink to="/courses" className={({ isActive }) => navClassName(isActive)}>
              {t("public.nav.courses")}
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => navClassName(isActive)}>
              {t("public.nav.projects")}
            </NavLink>
            <NavLink to="/enroll" className={({ isActive }) => navClassName(isActive)}>
              {t("public.nav.enroll")}
            </NavLink>
            <NavLink
              to="/verify-certificate"
              className={({ isActive }) => navClassName(isActive)}
            >
              {t("public.nav.verify")}
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => navClassName(isActive)}>
              {t("public.nav.about")}
            </NavLink>
            <NavLink
              to="/auth/login"
              className={({ isActive }) => navClassName(isActive)}
            >
              {t("public.nav.login")}
            </NavLink>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
