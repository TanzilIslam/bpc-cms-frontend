import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { CourseCard } from "@/components/shared/CourseCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAnnouncements } from "@/hooks/useAnnouncements"
import { useCourses } from "@/hooks/useCourses"
import { useTestimonials } from "@/hooks/useTestimonials"
import { formatDate } from "@/lib/formatters"

function renderStars(rating: number): string {
  if (rating <= 0) {
    return "-"
  }

  return "*".repeat(Math.min(Math.max(Math.round(rating), 1), 5))
}

export function HomePage() {
  const { t } = useTranslation()
  const { courses, isLoading, error, reload } = useCourses()
  const {
    announcements,
    isLoading: announcementsLoading,
    error: announcementsError,
    reload: reloadAnnouncements,
  } = useAnnouncements()
  const {
    testimonials,
    isLoading: testimonialsLoading,
    error: testimonialsError,
    reload: reloadTestimonials,
  } = useTestimonials()
  const featuredCourses = courses.slice(0, 3)
  const latestAnnouncements = announcements.slice(0, 3)
  const featuredTestimonials = testimonials
    .filter((testimonial) => testimonial.isFeatured)
    .slice(0, 3)
  const fallbackTestimonials =
    featuredTestimonials.length > 0 ? featuredTestimonials : testimonials.slice(0, 3)

  return (
    <section className="mx-auto grid max-w-6xl gap-10">
      <div className="grid gap-4 rounded-xl border bg-gradient-to-r from-blue-50 to-green-50 p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {t("home.label")}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          {t("home.title")}
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          {t("home.description")}
        </p>
        <Button asChild>
          <Link to="/enroll">{t("home.ctaEnroll")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/courses">{t("home.ctaBrowse")}</Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{t("home.featuredCourses")}</h2>
          <Button asChild variant="ghost">
            <Link to="/courses">{t("home.viewAll")}</Link>
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t("home.loadingFeaturedCourses")}</p>
        ) : error ? (
          <div className="space-y-2 rounded-lg border p-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void reload()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : featuredCourses.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("home.noPublishedCourses")}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id || course.slug} course={course} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{t("home.latestAnnouncements")}</h2>
        </div>

        {announcementsLoading ? (
          <p className="text-sm text-muted-foreground">{t("home.loadingAnnouncements")}</p>
        ) : announcementsError ? (
          <div className="space-y-2 rounded-lg border p-4">
            <p className="text-sm text-destructive">{announcementsError}</p>
            <Button variant="outline" size="sm" onClick={() => void reloadAnnouncements()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : latestAnnouncements.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("home.noAnnouncements")}
          </p>
        ) : (
          <div className="grid gap-3">
            {latestAnnouncements.map((announcement) => (
              <article key={announcement.id} className="space-y-2 rounded-lg border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{announcement.priority}</Badge>
                  <Badge variant="secondary">{announcement.targetAudience}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(announcement.publishDate)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{announcement.title}</h3>
                <p className="text-sm text-muted-foreground">{announcement.content}</p>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{t("home.successStories")}</h2>
        </div>

        {testimonialsLoading ? (
          <p className="text-sm text-muted-foreground">{t("home.loadingTestimonials")}</p>
        ) : testimonialsError ? (
          <div className="space-y-2 rounded-lg border p-4">
            <p className="text-sm text-destructive">{testimonialsError}</p>
            <Button variant="outline" size="sm" onClick={() => void reloadTestimonials()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : fallbackTestimonials.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("home.noTestimonials")}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {fallbackTestimonials.map((testimonial) => (
              <article key={testimonial.id} className="space-y-3 rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{testimonial.studentName}</p>
                  <Badge variant="outline">{renderStars(testimonial.rating)}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{testimonial.courseTitle}</p>
                <p className="text-sm text-muted-foreground">"{testimonial.review}"</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(testimonial.createdAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
