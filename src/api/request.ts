import { apiClient } from "@/api/client"
import { extractApiData, getHttpErrorMessage } from "@/api/http"

type PathList = readonly string[]

async function requestWithFallback<T>(
  paths: PathList,
  requester: (path: string) => Promise<T>
): Promise<T> {
  if (paths.length === 0) {
    throw new Error("No request paths were provided.")
  }

  let lastError: unknown = null

  for (const path of paths) {
    try {
      return await requester(path)
    } catch (error) {
      lastError = error
    }
  }

  throw new Error(getHttpErrorMessage(lastError))
}

export async function getWithFallback(paths: PathList): Promise<unknown> {
  return requestWithFallback(paths, async (path) => {
    const response = await apiClient.get(path)
    return extractApiData(response.data)
  })
}

export async function postWithFallback(
  paths: PathList,
  payload: Record<string, unknown>
): Promise<unknown> {
  return requestWithFallback(paths, async (path) => {
    const response = await apiClient.post(path, payload)
    return extractApiData(response.data)
  })
}

export async function putWithFallback(
  paths: PathList,
  payload: Record<string, unknown>
): Promise<unknown> {
  return requestWithFallback(paths, async (path) => {
    const response = await apiClient.put(path, payload)
    return extractApiData(response.data)
  })
}

export async function deleteWithFallback(paths: PathList): Promise<void> {
  await requestWithFallback(paths, async (path) => {
    await apiClient.delete(path)
  })
}
