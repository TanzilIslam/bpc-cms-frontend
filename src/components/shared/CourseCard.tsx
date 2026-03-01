import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatMoney } from "@/lib/formatters"
import type { Course } from "@/types/course"

type CourseCardProps = {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{course.difficultyLevel}</Badge>
          <span className="text-sm font-medium text-primary">{formatMoney(course.price)}</span>
        </div>
        <div className="space-y-1">
          <CardTitle className="line-clamp-2 text-xl">{course.title}</CardTitle>
          <CardDescription>
            {t("courseCard.durationMonths", { count: course.durationMonths })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">{course.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3">
        <Button asChild variant="outline" size="sm">
          <Link to={`/courses/${course.slug}`}>{t("courseCard.viewDetails")}</Link>
        </Button>
        <Button asChild size="sm">
          <Link to={`/enroll?course=${encodeURIComponent(course.title)}`}>
            {t("courseCard.enrollNow")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
