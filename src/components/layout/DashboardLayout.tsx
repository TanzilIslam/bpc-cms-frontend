import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";

import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth";

type DashboardNavItem = {
  label: string;
  to: string;
  end?: boolean;
};

type DashboardNavGroup = {
  titleKey: string;
  items: DashboardNavItem[];
};

const studentNav: DashboardNavItem[] = [
  { label: "Overview", to: "/student", end: true },
  { label: "My Courses", to: "/student/courses", end: true },
  { label: "Assignments", to: "/student/assignments", end: true },
  { label: "Progress", to: "/student/progress", end: true },
  { label: "Projects", to: "/student/projects", end: true },
  { label: "Certificate", to: "/student/certificate", end: true },
  { label: "Payments", to: "/student/payments", end: true },
];
const taNav: DashboardNavItem[] = [
  { label: "Overview", to: "/ta", end: true },
  { label: "My Batches", to: "/ta/batches", end: true },
  { label: "Attendance", to: "/ta/attendance", end: true },
  { label: "Student Progress", to: "/ta/progress", end: true },
  { label: "Grading", to: "/ta/grading", end: true },
];
const adminNav: DashboardNavItem[] = [
  { label: "Overview", to: "/admin", end: true },
  { label: "Students", to: "/admin/students", end: true },
  { label: "Courses", to: "/admin/courses", end: true },
  { label: "Batches", to: "/admin/batches", end: true },
  { label: "Payments", to: "/admin/payments", end: true },
];

const navByRole: Record<UserRole, DashboardNavGroup[]> = {
  SUPER_ADMIN: [
    { titleKey: "dashboard.groups.management", items: adminNav },
    { titleKey: "dashboard.groups.teaching", items: taNav },
  ],
  ADMIN: [
    { titleKey: "dashboard.groups.management", items: adminNav },
    { titleKey: "dashboard.groups.teaching", items: taNav },
  ],
  TA: [{ titleKey: "dashboard.groups.teaching", items: taNav }],
  STUDENT: [{ titleKey: "dashboard.groups.learning", items: studentNav }],
  ALUMNI: [],
  GUEST: [],
};
function navLinkClassName(isActive: boolean): string {
  return cn(
    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
  );
}

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const groups = user ? navByRole[user.role] : [];

  return (
    <div className="min-h-screen bg-muted/25">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
          <div>
            <p className="text-sm font-semibold">{t("dashboard.title")}</p>
            <p className="text-xs text-muted-foreground">
              {user?.fullName ?? t("common.unknownUser")} (
              {user?.role ?? t("common.unknownRole")})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="outline" size="sm" onClick={() => void logout()}>
              <LogOut className="mr-2 size-4" />
              {t("dashboard.logout")}
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-lg border bg-background p-4">
          <nav className="grid gap-6">
            {groups.map((group) => (
              <div key={group.titleKey} className="grid gap-2">
                <p className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                  {t(group.titleKey)}
                </p>
                <div className="grid gap-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) => navLinkClassName(isActive)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>
        <main className="rounded-lg border bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
