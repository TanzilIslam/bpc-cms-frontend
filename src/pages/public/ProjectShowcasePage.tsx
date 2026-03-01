import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProjects } from "@/hooks/useProjects"

export function ProjectShowcasePage() {
  const { projects, isLoading, error, reload } = useProjects()
  const [search, setSearch] = useState("")
  const [technology, setTechnology] = useState("ALL")

  const technologies = useMemo(() => {
    const unique = new Set<string>()
    projects.forEach((project) => {
      project.technologiesUsed.forEach((item) => unique.add(item))
    })
    return Array.from(unique).sort((left, right) => left.localeCompare(right))
  }, [projects])

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesSearch =
        normalizedSearch.length === 0
          ? true
          : project.title.toLowerCase().includes(normalizedSearch) ||
            project.description.toLowerCase().includes(normalizedSearch) ||
            project.studentName.toLowerCase().includes(normalizedSearch)

      const matchesTechnology =
        technology === "ALL"
          ? true
          : project.technologiesUsed.some(
              (item) => item.toLowerCase() === technology.toLowerCase()
            )

      return matchesSearch && matchesTechnology
    })
  }, [projects, search, technology])

  return (
    <section className="mx-auto grid max-w-6xl gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Student Project Showcase</h1>
        <p className="text-muted-foreground">
          Explore real projects built by Bhola Programming Club students.
        </p>
      </div>

      <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_220px]">
        <Input
          placeholder="Search by project, student, or description..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          value={technology}
          onChange={(event) => setTechnology(event.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="ALL">All Technologies</option>
          {technologies.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading showcase projects...</p>
      ) : error ? (
        <div className="space-y-2 rounded-lg border p-4">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => void reload()}>
            Retry
          </Button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No public projects found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <article key={project.id} className="overflow-hidden rounded-lg border bg-card">
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  loading="lazy"
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="flex h-52 items-center justify-center bg-muted text-sm text-muted-foreground">
                  No Preview Available
                </div>
              )}
              <div className="space-y-3 p-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {project.isFeatured ? <Badge>Featured</Badge> : null}
                    <Badge variant="outline">{project.studentName}</Badge>
                  </div>
                  <h2 className="text-lg font-semibold">{project.title}</h2>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologiesUsed.map((item) => (
                    <Badge key={`${project.id}-${item}`} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{project.viewsCount} views</span>
                  <span>{project.likesCount} likes</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.githubLink ? (
                    <Button asChild variant="outline" size="sm">
                      <a href={project.githubLink} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    </Button>
                  ) : null}
                  {project.liveDemoLink ? (
                    <Button asChild size="sm">
                      <a href={project.liveDemoLink} target="_blank" rel="noreferrer">
                        Live Demo
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
