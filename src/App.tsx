import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"

import { Toaster } from "@/components/ui/sonner"
import { useAuth } from "@/hooks/useAuth"
import { router } from "@/routes"

function App() {
  const initialize = useAuth().initialize

  useEffect(() => {
    void initialize()
  }, [initialize])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors closeButton />
    </>
  )
}

export default App
