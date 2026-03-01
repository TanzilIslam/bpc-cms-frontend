import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function UnauthorizedPage() {
  return (
    <section className="mx-auto grid max-w-xl gap-3 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Unauthorized</h1>
      <p className="text-muted-foreground">
        You do not have permission to access this page.
      </p>
      <div>
        <Button asChild variant="outline">
          <Link to="/">Go to Home</Link>
        </Button>
      </div>
    </section>
  )
}
