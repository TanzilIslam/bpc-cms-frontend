import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react"

function resolveErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }

  return fallback
}

type AsyncResourceOptions<T> = {
  initialData: T
  load: () => Promise<T>
  fallbackError: string
  autoLoad?: boolean
}

type AsyncResourceState<T> = {
  data: T
  setData: Dispatch<SetStateAction<T>>
  isLoading: boolean
  error: string | null
  setError: Dispatch<SetStateAction<string | null>>
  reload: () => Promise<void>
}

export function useAsyncResource<T>({
  initialData,
  load,
  fallbackError,
  autoLoad = true,
}: AsyncResourceOptions<T>): AsyncResourceState<T> {
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState(autoLoad)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const nextData = await load()
      setData(nextData)
    } catch (requestError) {
      setError(resolveErrorMessage(requestError, fallbackError))
    } finally {
      setIsLoading(false)
    }
  }, [fallbackError, load])

  useEffect(() => {
    if (!autoLoad) {
      return
    }

    void reload()
  }, [autoLoad, reload])

  return {
    data,
    setData,
    isLoading,
    error,
    setError,
    reload,
  }
}

type AsyncMutationState = {
  isMutating: boolean
  actionError: string | null
  setActionError: Dispatch<SetStateAction<string | null>>
  runMutation: <T>(operation: () => Promise<T>, fallbackError: string) => Promise<T>
}

export function useAsyncMutation(): AsyncMutationState {
  const [isMutating, setIsMutating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const runMutation = useCallback(
    async <T>(operation: () => Promise<T>, fallbackError: string): Promise<T> => {
      setIsMutating(true)
      setActionError(null)

      try {
        return await operation()
      } catch (requestError) {
        setActionError(resolveErrorMessage(requestError, fallbackError))
        throw requestError
      } finally {
        setIsMutating(false)
      }
    },
    []
  )

  return {
    isMutating,
    actionError,
    setActionError,
    runMutation,
  }
}
